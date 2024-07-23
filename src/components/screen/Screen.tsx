import { invoke } from "@tauri-apps/api/tauri";
import { Range } from "../range/Range";
import ScreenCSS from "./Screen.module.css";

async function updateScreenState(screen: string, value:number){
    try {
        await invoke('update_brightness', { screen, value });
        console.log('Brightness updated successfully');
      } catch (error) {
        console.error('Failed to update brightness:', error);
      }
}

interface ScreenProps {
    name: string;
}

export function Screen({ name } : ScreenProps ) {
    return(
        <div className={ScreenCSS.container}>
            <h4 className="">{name}</h4>
            <Range change={updateScreenState} current={name} />
        </div>
    )
}