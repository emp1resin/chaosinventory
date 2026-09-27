import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const features = [
  ['vital', 'Живучесть'], ['dps', 'ДПС'], ['pointOnBite', 'ОД на действие', 'ap'],
  ['damage', 'Урон', 'range'], ['penetrationOfResist', 'Пробой сопротивляемости', 'penetration'],
  ['hp', 'Здоровье'], ['mp', 'Мана'], ['power', 'Сила'], ['body', 'Телосложение'],
  ['dex', 'Ловкость'], ['intell', 'Интеллект'], ['stamina', 'Выносливость'], ['will', 'Воля'],
  ['powerOfDark', 'Призыватель'], ['powerOfLight', 'Заклинатель'],
  ['powerOfDestruction', 'Разрушитель'], ['powerOfDefiler', 'Осквернитель'], ['powerOfPray', 'Вера'],
  ['criticalDamage', 'Крит. удар'], ['criticalMultiplier', 'Множитель крит. урона'],
  ['bleedingChance', 'Шанс кровотечения'], ['stability', 'Устойчивость'],
  ['armorPenetration', 'Пробой брони'], ['parry', 'Парирование'], ['reaction', 'Реакция'],
  ['atack', 'Атака'], ['defense', 'Защита'], ['armor', 'Броня', 'defence'],
  ['resists', 'Сопротивляемость', 'defence'], ['regenerationHP', 'Реген здоровья'],
  ['regenerationMP', 'Реген маны'], ['pointsOfAction', 'Всего ОД'], ['weigth', 'Переносимый вес'],
  ['expirienceInBattle', 'Доп. опыт'], ['darkSpellManaLowerCost', 'Сниж. маны на Тьму'],
  ['lightSpellManaLowerCost', 'Сниж. маны на Свет'], ['destrSpellManaLowerCost', 'Сниж. маны на Стихию'],
  ['mindSpellManaLowerCost', 'Сниж. маны на Разум'], ['praySpellManaLowerCost', 'Сниж. маны на Веру'],
  ['magicDamage', 'Доп. маг. урон'], ['doubleChance', 'Шанс двойного удара'],
  ['counterattack', 'Шанс контрудара'], ['dodgeBySpell', 'Уклонение от заклинания'],
  ['dodge', 'Уклонение'], ['shieldBlock_1', 'Блок щитом: контакт'],
  ['shieldBlock_2', 'Блок щитом: арбалет'], ['shieldBlock_3', 'Блок щитом: лук'],
  ['resistDamage', 'Поглощение урона'], ['resistTempraryEffects', 'Сопрот. временным эффектам'],
  ['reflectionResistance', 'Снижение отражённого урона'], ['physicalVampirism', 'Физический вампиризм'],
  ['magicalVampirism', 'Магический вампиризм'], ['summonsApPercent', 'Снижение ОД призванных'],
  ['startAp', 'ОД в начале боя'], ['summonsStartAp', 'ОД призванных в начале'],
  ['rageGain', 'Прирост ярости'], ['alchemySaving', 'Экономия алхим. зелий'],
  ['temporaryResistanceIgnore', 'Игнор сопротивления врем. урону'],
  ['rage100FromComplects', 'Ярость в начале боя'],
];

const safe = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const rounded = (value) => Math.round(safe(value) * 100) / 100;

function score(value, type) {
  if (type === 'range') return (safe(value?.[0]) + safe(value?.[1])) / 2;
  if (type === 'ap') return safe(value?.[1]);
  if (Array.isArray(value)) return safe(value[0]);
  return safe(value);
}

function format(value, type) {
  if (type === 'range') return `${rounded(value?.[0])}–${rounded(value?.[1])}`;
  if (type === 'ap') return `${rounded(value?.[0])} (${rounded(value?.[1])})`;
  if (type === 'defence') return `${rounded(value?.[0])} (${rounded(value?.[1])}%)`;
  if (type === 'penetration') return `${rounded(value?.[0])} + ${rounded(value?.[1])}%`;
  return String(rounded(value));
}

function difference(first, second, type) {
  if (type === 'range') {
    return `${Math.abs(rounded(safe(second?.[0]) - safe(first?.[0])))}…${Math.abs(rounded(safe(second?.[1]) - safe(first?.[1])))}`;
  }
  return String(Math.abs(rounded(score(second, type) - score(first, type))));
}

export default function LocalBuildForDiff({ names, data }) {
  return (
    <TableContainer component={Paper} className="comparison-table">
      <Table size="small" stickyHeader aria-label="Сравнение билдов">
        <TableHead>
          <TableRow>
            <TableCell>Параметр</TableCell>
            <TableCell align="right">{names[0]}</TableCell>
            <TableCell align="right">{names[1]}</TableCell>
            <TableCell>Преимущество</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {features.map(([key, label, type]) => {
            const first = data[0]?.[key];
            const second = data[1]?.[key];
            const firstScore = score(first, type);
            const secondScore = score(second, type);
            const equal = Math.abs(firstScore - secondScore) < 0.0001;
            const secondWins = type === 'ap' ? secondScore < firstScore : secondScore > firstScore;
            const winner = equal ? null : secondWins ? 1 : 0;
            const winnerName = winner === null ? '' : names[winner];
            const diff = difference(first, second, type);

            return (
              <TableRow key={key} className={equal ? 'comparison-equal' : 'comparison-changed'}>
                <TableCell component="th" scope="row">{label}</TableCell>
                <TableCell align="right" className={winner === 0 ? 'comparison-winner' : winner === 1 ? 'comparison-loser' : ''}>
                  {format(first, type)}
                </TableCell>
                <TableCell align="right" className={winner === 1 ? 'comparison-winner' : winner === 0 ? 'comparison-loser' : ''}>
                  {format(second, type)}
                </TableCell>
                <TableCell className={winner === null ? 'comparison-neutral' : 'comparison-advantage'}>
                  {winner === null ? 'Равны' : `${winnerName} лучше на ${diff}`}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
