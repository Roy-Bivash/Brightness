#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;
use tauri::command;

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Preferences {
    state: String,
}

#[derive(Serialize)]
struct CompatibilityResponse {
    compatible: bool,
    message: String,
}

struct AppState(Mutex<Preferences>);

#[tauri::command]
fn get_preferences(state: State<AppState>) -> Preferences {
    state.0.lock().unwrap().clone()
}

#[tauri::command]
fn set_preferences(state: State<AppState>, new_prefs: Preferences) {
    let mut prefs = state.0.lock().unwrap();
    *prefs = new_prefs;
}

#[command]
fn get_screen_list() -> Result<String, String> {
    use std::process::Command;
    // Run the command to list connected displays
    let output = Command::new("sh")
        .arg("-c")
        .arg("xrandr -q | grep ' connected'")
        .output();

    match output {
        Ok(output) => {
            if output.status.success() {
                // Convert output to string and return
                match String::from_utf8(output.stdout) {
                    Ok(s) => Ok(s),
                    Err(e) => Err(format!("Failed to parse output: {}", e)),
                }
            } else {
                let error_message = String::from_utf8_lossy(&output.stderr);
                Err(format!("Command failed: {}", error_message))
            }
        },
        Err(e) => Err(format!("Failed to execute command: {}", e)),
    }
}

#[command]
fn update_brightness(screen: String, value: f32) -> Result<(), String> {
    use std::process::Command;
    let command = format!("xrandr --output {} --brightness {}", screen, value);
    let output = Command::new("sh")
        .arg("-c")
        .arg(command)
        .output();

    match output {
        Ok(output) => {
            if output.status.success() {
                Ok(())
            } else {
                let error_message = String::from_utf8_lossy(&output.stderr);
                Err(format!("Command failed: {}", error_message))
            }
        },
        Err(e) => Err(format!("Failed to execute command: {}", e)),
    }
}

#[tauri::command]
fn check_compatibility() -> Result<CompatibilityResponse, String> {
    let session_type = std::env::var("XDG_SESSION_TYPE").unwrap_or_else(|_| "unknown".to_string());

    if session_type == "x11" {
        // If Xorg, xrandr is compatible
        Ok(CompatibilityResponse {
            compatible: true,
            message: "Your system is compatible with xrandr.".to_string(),
        })
    } else if session_type == "wayland" {
        // If Wayland, xrandr won't work
        Ok(CompatibilityResponse {
            compatible: false,
            message: "Your system is running Wayland. xrandr is not compatible, please use a Wayland-compatible tool.".to_string(),
        })
    } else {
        // Handle unknown session types
        Ok(CompatibilityResponse {
            compatible: false,
            message: format!("Could not detect the session type. Detected: {}", session_type),
        })
    }
}


fn main() {
    let initial_preferences = Preferences {
        state: "Combined".to_string(),
    };

    tauri::Builder::default()
        .manage(AppState(Mutex::new(initial_preferences)))
        .invoke_handler(tauri::generate_handler![get_preferences, set_preferences, get_screen_list, update_brightness, check_compatibility])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
