import { useEffect, useState } from "react";
import RangeCSS from "./Range.module.css";
import plusIcon from "../../assets/icons/plus.png";
import minusIcon from "../../assets/icons/minus.png";

interface RangeProps {
    change: (name:string, value: number) => void;
    current: string;
}

export function Range({ change, current }: RangeProps) {
    const [level, setLevel] = useState(1);
    const steps = 0.02;

    useEffect(() => {
        if (level <= 1 && level >= 0.1) {
            change(current, level);
        }
    }, [level])

    function buttonPress(action:'+'|'-'|'max'|'min'){
        // increase Level
        if(action == '+'){
            if(level < 1){
                setLevel(level+steps);
            }
        }
        // decrease Level
        if(action == '-'){
            if(level > 0) {
                setLevel(level-steps);
            }
        }
        // set to max
        if(action == 'max'){
            setLevel(1);
        }
        // set to min
        if(action == 'min'){
            setLevel(0.1);
        }
    }

    return (
        <div className={RangeCSS.container}>
            <button className={RangeCSS.btnMinMax} type="button" onClick={() => buttonPress('min')}>Min</button>
            <button className={RangeCSS.btnIcon} type="button" onClick={() => buttonPress('-')}>
                <img src={minusIcon} alt="minus" className={RangeCSS.actionIcon} />
            </button>
            <input
                className={RangeCSS.theRange}
                value={level} onChange={e => setLevel(parseFloat(e.target.value))}
                type="range" min="0.1" max="1" step={steps}
            />
            <button className={RangeCSS.btnIcon} type="button" onClick={() => buttonPress('+')}>
                <img src={plusIcon} alt="plus" className={RangeCSS.actionIcon} />
            </button>
            <button className={RangeCSS.btnMinMax} type="button" onClick={() => buttonPress('max')}>Max</button>
        </div>
    )
}