import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

const runePrices = {
  c: 7000, f: 7000, h: 7000, k: 7000, m: 7000, p: 7000, r: 7000, x: 7000, z: 7000,
  b: 20000, g: 20000, l: 20000, n: 20000, q: 20000, s: 20000, w: 20000,
  a: 30000, d: 30000, e: 30000, i: 30000, j: 30000, o: 30000, t: 30000, u: 30000, v: 30000, y: 30000,
};

const runeWordScrollPrices = {
  storm: 5000, vortex: 6000, exort: 5000, wywirn: 6000, zenit: 5000,
  aurelium: 8000, elementum: 9000, jinada: 6000, conquest: 8000,
  omega: 5000, tanatos: 7000, xenos: 5000, cataclysm: 9000,
  onikz: 5000, devotion: 8000,
};

const format = (value) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value);

function BuildCost({ thingOnPers, modifireThings, changeEquip, runesChange }) {
  const [enabled, setEnabled] = useState(false);

  const totals = useMemo(() => {
    let silver = 0;
    let gold = 0;
    let controlPointsRunes = 0;
    let controlPointsWords = 0;

    for (const [slot, item] of Object.entries(thingOnPers)) {
      if (!item || item.name === 'Нет') continue;
      const cost = Number(item.cost) || 0;
      if ((item.costType || '').includes('золото')) gold += cost;
      else silver += cost;

      const modified = modifireThings[slot] || {};
      for (const rune of (modified.runes || '').toLowerCase()) {
        controlPointsRunes += runePrices[rune] || 0;
      }
      controlPointsWords += runeWordScrollPrices[(modified.runeWord || '').toLowerCase()] || 0;
    }

    return { silver, gold, controlPointsRunes, controlPointsWords };
  }, [thingOnPers, modifireThings, changeEquip, runesChange]);

  return (
    <section className="cost-estimate">
      <FormControlLabel
        control={<Switch checked={enabled} onChange={(event) => setEnabled(event.target.checked)} color="primary" />}
        label="Показать достоверную стоимость"
      />
      {enabled && (
        <div className="cost-estimate-grid">
          <div><span>Вещи из магазина</span><strong>{format(totals.silver)} серебра</strong></div>
          <div><span>Артефакты за золото</span><strong>{format(totals.gold)} золота</strong></div>
          <div><span>Руны</span><strong>{format(totals.controlPointsRunes)} очков контроля</strong></div>
          <div><span>Свитки рунных слов</span><strong>{format(totals.controlPointsWords)} очков контроля</strong></div>
          <Typography variant="caption" className="cost-disclaimer">
            Модификации, руны Разлома и аукционная цена не включены: официальных формул и фиксированных рыночных цен в FAQ нет.
          </Typography>
        </div>
      )}
    </section>
  );
}

const mapStateToProps = (state) => ({
  thingOnPers: state.thingOnPers,
  modifireThings: state.modifireThings,
  changeEquip: state.changeEquip,
  runesChange: state.runesChange,
});

export default connect(mapStateToProps)(BuildCost);
