import React from 'react';
import { connect } from 'react-redux';
import { elixirs, elixirDescription } from '../data/elixirs';

function ElixirsInput({ selected = [], charBless, dispatch }) {
  const choose = (item) => {
    if (item.id === 'crystal' && !selected.includes('crystal') && charBless !== 'Нет') {
      dispatch({ type: 'Смена Блага Характеристик', data: 'Нет' });
    }
    dispatch({ type: 'Переключить эликсир', data: item.id });
  };

  return <section className="elixirs-config" aria-label="Эликсиры и бафы">
    <h3>Эликсиры и бафы</h3>
    <p>Выберите действующие эффекты вручную. Эликсиры с одинаковым параметром заменяют друг друга. Активные бафы не приходят из открытого профиля.</p>
    <p className="elixirs-note">Предварительный расчёт для «+X и +Y%»: текущий параметр × (1 + Y/100) + X. Точный порядок игры уточним по контрольным значениям.</p>
    <div className="elixirs-list">
      {elixirs.map(item => <label key={item.id} className={`elixir-option${selected.includes(item.id) ? ' selected' : ''}${item.unknown ? ' unknown' : ''}`}>
        <input type="checkbox" checked={selected.includes(item.id)} onChange={() => choose(item)} disabled={Boolean(item.unknown)} />
        <span><strong>{item.name}</strong><small>{elixirDescription(item)} · {item.source}</small></span>
      </label>)}
    </div>
    <p className="elixirs-note">Зелья мгновенного восстановления здоровья и маны не меняют постоянные параметры и здесь не выбираются.</p>
  </section>;
}

export default connect(state => ({ selected: state.elixirs, charBless: state.charBless }))(ElixirsInput);
