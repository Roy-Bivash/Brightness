#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;
use tauri::command;

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Preferences {
    state: String,
    theme: String,
    custom_theme: serde_json::Value,
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

fn main() {
    let initial_preferences = Preferences {
        state: "combined".to_string(),
        theme: "light".to_string(),
        custom_theme: serde_json::json!({}),
    };

    tauri::Builder::default()
        .manage(AppState(Mutex::new(initial_preferences)))
        .invoke_handler(tauri::generate_handler![get_preferences, set_preferences, get_screen_list, update_brightness])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
