import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/navbar/Navbar";
import SettingCSS from "./Setting.module.css";

interface preferencesInterface {
    state: 'individual' | 'Combined';
    theme: 'dark' | 'light';
    custom_theme: Object;
}

async function getPreferences(): Promise<preferencesInterface | null> {
    try {
        const preferences: preferencesInterface = await invoke('get_preferences');
        return preferences;
    } catch (error) {
        console.log("error : ", error);
        return null;
    }
}


export function Setting() {
    const [userPreferences, setUserPreferences] = useState<preferencesInterface | null>(null);
    const [test, setTest] = useState("");
    async function setPreferences(preferences: preferencesInterface | null) {
        if(preferences){
            try {
                await invoke('set_preferences', { new_prefs: preferences });
                console.log('Preferences updated');
                setTest("Preferences updated")
            } catch (error) {
                setTest(error);
                console.error('Error setting preferences:', error);
            }
        }
    }

    useEffect(() => {
        async function run() {
            const pref = await getPreferences();
            setUserPreferences(pref);
        }
        run();
    }, []);


    function updateState(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target;
        if (userPreferences) {
            let updatedPreferences = { ...userPreferences };
            updatedPreferences.state = (checked) ? "individual" : "Combined";
            setUserPreferences(updatedPreferences);
        }
    }

    return (
        <>
            <Navbar current="Setting" />
            <main className={SettingCSS.container}>
                <h3>Settings</h3>
                <label htmlFor="showScreensOnStartup">Show all the screens on startup : </label>
                <input 
                    type="checkbox" 
                    name="showScreensOnStartup" 
                    id="showScreensOnStartup" 
                    checked={(userPreferences?.state === "individual")} 
                    onChange={updateState} 
                />
                <br /><br />
                <label htmlFor="">Theme : </label>
                <i>Comming soon</i>
                <br />
                <button onClick={() => setPreferences(userPreferences)} className={SettingCSS.saveBtn} type="button">Save</button>
                {/* {JSON.stringify(test)} */}
            </main>
        </>
    )
}
