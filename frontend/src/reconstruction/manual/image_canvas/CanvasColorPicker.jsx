import { useState } from 'react';
import { SketchPicker } from 'react-color';

export default function ColorPickerComponent({initColor, onColorChanged, title}) {
    const [color, setColor] = useState(initColor);

    const handleChangeComplete = (color) => {
        setColor(color.hex);
        onColorChanged(color.hex)
    };

    return (
        <div className='color-picker'>
            <h2 className="color-picker__title">{title}</h2>
            <SketchPicker
                color={color}
                onChangeComplete={handleChangeComplete}
            />
        </div>
    );
}