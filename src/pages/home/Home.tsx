import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/navbar/Navbar";
import { Screen } from "../../components/screen/Screen";

import HomeCSS from './Home.module.css';

interface preferencesInterface {
    state: 'individual' | 'Combined';
    theme: 'dark' | 'light';
    custom_theme: Object;
};

async function getPreferences(): Promise<preferencesInterface | null> {
    try {
      const preferences:preferencesInterface = await invoke('get_preferences');
      return preferences;
    } catch (error) {
        console.log("error : ", error);
        return null;
    }
}

async function setPreferences(preferences: preferencesInterface) {
    try {
        await invoke('set_preferences', { new_prefs: preferences });
        console.log('Preferences updated');
    } catch (error) {
        console.error('Error setting preferences:', error);
    }
}

function parseScreenInfo(rawData:string) {
    // Regular expression to match screen names
    const screenNameRegex = /(\S+) connected/g;
  
    const screenNames = [];
    let match;
    while ((match = screenNameRegex.exec(rawData)) !== null) {
      screenNames.push(match[1]);
    }
  
    return screenNames;
}

async function getScreenList() : Promise<Array<string>> {
    try {
      const data:string = await invoke("get_screen_list");
      const processedData = parseScreenInfo(data)
      return processedData;
    } catch (err) {
      console.log("Failed to fetch screen list: ", err);
      return [];
    }
}


export function Home(){
    const [userPreferences, setUserPreferences] = useState<preferencesInterface | null>(null);
    const [screenList, setScreenList] = useState<Array<string>>([]);
    const [show, setShow] = useState<"Combined" | "individual">("individual");

    useEffect(() => {
        async function run(){
            const pref = await getPreferences();
            setUserPreferences(pref);
            setShow(pref?.state || "individual");

            const screens = await getScreenList();
            setScreenList(screens);
        }
        run();
    }, []);


    return(
        <>
            <Navbar current="Home" />
            <main>
                <div className={HomeCSS.option}>
                    <p>Option : </p>
                    <button type="button" data-selected={(show == "Combined")} onClick={() => setShow("Combined")}>Combined</button>
                    <button type="button" data-selected={(show == "individual")} onClick={() => setShow("individual")}>Individual</button>
                </div>
                {show == "individual" && (
                    screenList.map((el, i) => (
                        <Screen key={i} name={el} list={[]} />
                    ))
                )}
                {show == "Combined" && (
                    <Screen name={"Combined"} list={screenList} />
                )}

                {/* {JSON.stringify(userPreferences)} */}
            </main>
        </>
    )
}