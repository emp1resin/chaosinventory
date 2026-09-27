import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LocalBuildForDiff from './LocalBuildForDiff';
import { Result } from './Results';

function resultProps(data) {
  return {
    level: data.levelChange,
    powerChange: data.powerChange,
    bodyChange: data.bodyChange,
    dexChange: data.dexChange,
    intellChange: data.intellChange,
    staminaChange: data.staminaChange,
    willChange: data.willChange,
    allSkills: data.allSkills,
    allSkillsMaster: data.allSkillsMaster,
    changeSkills: data.changeSkills,
    changeEquip: data.changeEquip,
    race: data.race,
    thingOnPers: data.thingOnPers,
    religion: data.religion,
    religionData: data.religionData,
    clanPosition: data.clanPosition,
    clanGlory: data.clanGlory,
    clansArtSword: data.clansArtSword,
    clansArtSphere: data.clansArtSphere,
    clansArtRune: data.clansArtRune,
    clansArtMask: data.clansArtMask,
    turnireRune: data.turnireRune,
    profession: data.profession,
    professionLevel: data.professionLevel,
    clan: data.clan,
    fractionReputation: data.fractionReputation,
    modifireThings: data.modifireThings,
    runesChange: data.runesChange,
    charBless: data.charBless,
    lifeBless: data.lifeBless,
  };
}

const emptyBuild = { id: '', name: 'Не выбрано', data: null, result: null };

export default function DiffBuilds({ list }) {
  const [first, setFirst] = useState(emptyBuild);
  const [second, setSecond] = useState(emptyBuild);

  const choose = (id, setter) => {
    const item = list.find((entry) => entry.roomHash === id);
    setter(item ? {
      id,
      name: item.name,
      data: JSON.parse(item.dataRoom),
      result: null,
    } : emptyBuild);
  };

  return (
    <div className="compare-drawer">
      <Typography variant="h5" gutterBottom>Сравнение билдов</Typography>
      <Typography variant="body2" gutterBottom>
        Значения рассчитываются тем же актуальным движком, что и панель «Результаты».
      </Typography>

      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <FormControl style={{ minWidth: 190 }}>
            <InputLabel>Билд 1</InputLabel>
            <Select value={first.id} onChange={(event) => choose(event.target.value, setFirst)}>
              {list.map((item) => <MenuItem key={item.roomHash} value={item.roomHash}>{item.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl style={{ minWidth: 190 }}>
            <InputLabel>Билд 2</InputLabel>
            <Select value={second.id} onChange={(event) => choose(event.target.value, setSecond)}>
              {list.map((item) => <MenuItem key={item.roomHash} value={item.roomHash}>{item.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {first.data && <Result
        key={`first-${first.id}`}
        {...resultProps(first.data)}
        renderless
        onComputed={(result) => setFirst((current) => ({ ...current, result }))}
      />}
      {second.data && <Result
        key={`second-${second.id}`}
        {...resultProps(second.data)}
        renderless
        onComputed={(result) => setSecond((current) => ({ ...current, result }))}
      />}

      {first.result && second.result
        ? <LocalBuildForDiff names={[first.name, second.name]} data={[first.result, second.result]} />
        : <Typography className="empty-copy">Выберите два сохранённых билда.</Typography>}
    </div>
  );
}
