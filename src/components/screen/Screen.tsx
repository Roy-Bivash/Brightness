import { invoke } from "@tauri-apps/api/tauri";
import { Range } from "../range/Range";
import ScreenCSS from "./Screen.module.css";

interface ScreenProps {
    name: string;
    list: Array<string>;
}

async function updateBrightness(screen: string, value: number) {
    try {
        await invoke('update_brightness', { screen, value });
    } catch (error) {
        console.error('Failed to update brightness:', error);
    }
}

export function Screen({ name, list }: ScreenProps) {

    async function updateScreenState(screen: string, value: number) {
        if (screen == "Combined") {
            const updatePromises = list.map(screenName => updateBrightness(screenName, value));
            await Promise.all(updatePromises);
        } else {
            await updateBrightness(screen, value);
        }
    }

    return (
        <div className={ScreenCSS.container}>
            <h4 className={ScreenCSS.title}>{name}</h4>
            <Range change={updateScreenState} current={name} />
        </div>
    );
}
