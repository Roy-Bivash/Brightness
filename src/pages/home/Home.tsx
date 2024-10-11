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

interface ErrorInterface {
    message: string;
    show: boolean;
}

interface CompatibilityResponse {
    compatible: boolean;
    message: string;
}

async function getPreferences(): Promise<preferencesInterface | null> {
    try {
      const preferences:preferencesInterface = await invoke('get_preferences');
      return preferences;
    } catch (error) {
        console.log("error : ", error);
        return null;
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

async function checkSystemCompatibility() {
    try {
        const response: CompatibilityResponse = await invoke("check_compatibility");
        return(response);
    } catch (error) {
        return({ compatible: false, message: "Error checking system compatibility." });
    }
}

export function Home(){
    const [userPreferences, setUserPreferences] = useState<preferencesInterface | null>(null);
    const [screenList, setScreenList] = useState<Array<string>>([]);
    const [show, setShow] = useState<"Combined" | "individual">("individual");
    const [error, setError] = useState<ErrorInterface>({ message: "", show: false });

    useEffect(() => {
        async function run(){
            const pref = await getPreferences();
            setUserPreferences(pref);
            setShow(userPreferences?.state || "individual");

            const screens = await getScreenList();
            setScreenList(screens);

            const compatibility = await checkSystemCompatibility();
            if(!compatibility.compatible){
                setError({
                    show:true,
                    message: compatibility.message
                })
            }
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

                {error.show && (
                    <p className={HomeCSS.error}>
                        Error : {error.message}
                    </p>
                )}
                
            </main>
        </>
    )
}