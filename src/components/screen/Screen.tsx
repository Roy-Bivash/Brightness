import { invoke } from "@tauri-apps/api/tauri";
import { Range } from "../range/Range";
import ScreenCSS from "./Screen.module.css";


interface ScreenProps {
    name: string;
    list: Array<string>;
}

async function updateBrightness(screen: string, value:number){
    try {
        await invoke('update_brightness', { screen, value });
        console.log('Brightness updated successfully');
    } catch (error) {
        console.error('Failed to update brightness:', error);
    }
}

export function Screen({ name, list } : ScreenProps ) {
    async function updateScreenState(screen: string, value:number){
        if(screen == "combined"){
            for (let i = 0; i < list.length; i++) {
                updateBrightness(list[i], value);
            }
        }else{
            updateBrightness(screen, value);
        }
    }

    return(
        <div className={ScreenCSS.container}>
            <h4 className="">{name}</h4>
            <Range change={updateScreenState} current={name} />
        </div>
    )
}