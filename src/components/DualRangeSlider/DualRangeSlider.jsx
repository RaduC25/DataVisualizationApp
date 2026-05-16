import { useState, useEffect } from 'react';
import './DualRangeSlider.css';

const DualRangeSlider = ({ label, min, max, valueMin, valueMax, onChangeMin, onChangeMax, formatValue }) => {
  const pctMin = max > min ? ((valueMin - min) / (max - min)) * 100 : 0;
  const pctMax = max > min ? ((valueMax - min) / (max - min)) * 100 : 100;
  const step = Math.max(1, Math.ceil((max - min) / 1000));

  const [minText, setMinText] = useState(formatValue(valueMin));
  const [maxText, setMaxText] = useState(formatValue(valueMax));
  const [minFocused, setMinFocused] = useState(false);
  const [maxFocused, setMaxFocused] = useState(false);

  useEffect(() => { if (!minFocused) setMinText(formatValue(valueMin)); }, [valueMin, minFocused]);
  useEffect(() => { if (!maxFocused) setMaxText(formatValue(valueMax)); }, [valueMax, maxFocused]);

  const handleMinSlider = (e) => onChangeMin(Math.min(Number(e.target.value), valueMax - step));
  const handleMaxSlider = (e) => onChangeMax(Math.max(Number(e.target.value), valueMin + step));

  const handleMinFocus = () => { setMinFocused(true); setMinText(String(valueMin)); };
  const handleMaxFocus = () => { setMaxFocused(true); setMaxText(String(valueMax)); };

  const handleMinBlur = () => {
    setMinFocused(false);
    const val = Number(minText);
    if (!isNaN(val) && val >= min && val < valueMax) {
      onChangeMin(val);
    } else {
      setMinText(formatValue(valueMin));
    }
  };

  const handleMaxBlur = () => {
    setMaxFocused(false);
    const val = Number(maxText);
    if (!isNaN(val) && val <= max && val > valueMin) {
      onChangeMax(val);
    } else {
      setMaxText(formatValue(valueMax));
    }
  };

  return (
    <div className="dual-slider">
      <div className="dual-slider__label">{label}</div>
      <div className="dual-slider__values">
        <input
          type="text"
          inputMode="numeric"
          className="dual-slider__value-input"
          value={minText}
          onChange={(e) => setMinText(e.target.value)}
          onFocus={handleMinFocus}
          onBlur={handleMinBlur}
        />
        <span className="dual-slider__sep">–</span>
        <input
          type="text"
          inputMode="numeric"
          className="dual-slider__value-input"
          value={maxText}
          onChange={(e) => setMaxText(e.target.value)}
          onFocus={handleMaxFocus}
          onBlur={handleMaxBlur}
        />
      </div>
      <div className="dual-slider__track-wrap">
        <div className="dual-slider__track">
          <div
            className="dual-slider__fill"
            style={{ left: `${pctMin}%`, width: `${pctMax - pctMin}%` }}
          />
        </div>
        <input
          type="range"
          className="dual-slider__input"
          min={min} max={max} step={step}
          value={valueMin}
          onChange={handleMinSlider}
        />
        <input
          type="range"
          className="dual-slider__input"
          min={min} max={max} step={step}
          value={valueMax}
          onChange={handleMaxSlider}
        />
      </div>
    </div>
  );
};

export default DualRangeSlider;
