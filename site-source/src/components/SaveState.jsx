import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/SwipeableDrawer';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DeleteIconModule from '@material-ui/icons/Delete';
const DeleteIcon = DeleteIconModule.default?.default || DeleteIconModule.default || DeleteIconModule;
import DiffBuilds from './DiffBuilds';

const STORAGE_KEY = 'chaos-build-forge:saves:v1';

function cloneSnapshot(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function readSaves() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function SaveState({ snapshot, dispatch }) {
  const [name, setName] = useState('');
  const [list, setList] = useState(readSaves);
  const [saveOpen, setSaveOpen] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, [list]);

  const legacyList = useMemo(() => list.map((item) => ({
    ...item,
    roomHash: item.id,
    dataRoom: JSON.stringify(item.data),
    status: 1,
  })), [list]);

  const save = () => {
    const cleanName = name.trim();
    if (!cleanName) return;
    setList((current) => [{
      id: crypto.randomUUID(),
      name: cleanName,
      date: new Date().toLocaleString('ru-RU'),
      data: cloneSnapshot(snapshot),
    }, ...current]);
    setName('');
  };

  const load = (item) => dispatch({ type: 'Загрузить все данные игрока', data: cloneSnapshot(item.data) });
  const remove = (id) => setList((current) => current.filter((item) => item.id !== id));

  return (
    <>
      <div className="save-actions">
        <Button variant="outlined" color="primary" onClick={() => setSaveOpen(true)}>
          Сохранения ({list.length})
        </Button>
        <Button variant="outlined" color="primary" disabled={list.length < 2} onClick={() => setDiffOpen(true)}>
          Сравнение
        </Button>
      </div>

      <Drawer anchor="left" open={saveOpen} onClose={() => setSaveOpen(false)} onOpen={() => setSaveOpen(true)}>
        <div className="drawer-content">
          <Typography variant="h5">Мои билды</Typography>
          <Typography variant="body2">Хранятся только в этом браузере.</Typography>
          <div className="save-form">
            <TextField id="saved-build-name" label="Название билда" value={name} onChange={(event) => setName(event.target.value)} />
            <Button variant="contained" color="primary" onClick={save}>Сохранить текущий</Button>
          </div>
          <Divider />
          {!list.length && <Typography className="empty-copy">Сохранённых билдов пока нет.</Typography>}
          {list.map((item) => (
            <div className="save-row" key={item.id}>
              <div>
                <Typography>{item.name}</Typography>
                <Typography variant="caption">{item.date}</Typography>
              </div>
              <div>
                <Button size="small" color="primary" onClick={() => load(item)}>Загрузить</Button>
                <IconButton aria-label="Удалить" onClick={() => remove(item.id)}><DeleteIcon /></IconButton>
              </div>
            </div>
          ))}
        </div>
      </Drawer>

      <Drawer anchor="right" open={diffOpen} onClose={() => setDiffOpen(false)} onOpen={() => setDiffOpen(true)}>
        <DiffBuilds list={legacyList} />
      </Drawer>
    </>
  );
}

const mapStateToProps = (state) => {
  const { getAllState: _ignored, ...snapshot } = state;
  return { snapshot };
};

export default connect(mapStateToProps)(SaveState);
