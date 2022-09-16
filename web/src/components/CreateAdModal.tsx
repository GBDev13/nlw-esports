import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Check, GameController } from 'phosphor-react';
import { Input } from './Form/Input';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface Game {
  id: string;
  title: string;
}

const days = [
  {
    value: '0',
    title: 'Domingo'
  },
  {
    value: '1',
    title: 'Segunda'
  },
  {
    value: '2',
    title: 'Terça'
  },
  {
    value: '3',
    title: 'Quarta'
  },
  {
    value: '4',
    title: 'Quinta'
  },
  {
    value: '5',
    title: 'Sexta'
  },
  {
    value: '6',
    title: 'Sábado'
  }
];

export function CreateAdModal() {
  const [games, setGames] = useState<Game[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [useVoiceChannel, setUseVoiceChannel] = useState(false);

  const getGames = useCallback(async () => {
    const { data } = await api.get('/games');
    setGames(data)
  }, [])

  useEffect(() => {
    getGames()
  }, []);

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    if(!data.name) return;

    try {
      await api.post(`/games/${data.game}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        useVoiceChannel
      });

      alert('Anúncio criado com sucesso!')
    } catch(err) {
      console.log(err)
      alert('Erro ao criar o anúncio!')
    }
  }

  return (
    <Dialog.Portal>
    <Dialog.Overlay className="bg-black/60 inset-0 fixed" />

    <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
      <Dialog.Title className="text-3xl font-black">Publique um anúncio</Dialog.Title>

        <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="game" className="font-semibold">Qual o game?</label>
            <select
              name="game"
              id="game"
              className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none"
              defaultValue=""
            >
              <option disabled value="">Selecione o game que deseja jogar</option>
              {games.map(game => <option key={game.id} value={game.id}>{game.title}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name">Seu nome (ou nickname)</label>
            <Input name="name" id="name" placeholder="Como te chamam dentro do game?" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="yearsPlaying">Joga a quantos anos?</label>
              <Input name="yearsPlaying" id="yearsPlaying" type="number" placeholder="Tudo bem ser ZERO" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="discord">Qual o seu Discord?</label>
              <Input name="discord" id="discord" type="text" placeholder="Usuario#0000" />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="weekDays">Quando costuma jogar?</label>

              <ToggleGroup.Root
                type="multiple"
                className="grid grid-cols-4 gap-2"
                value={weekDays}
                onValueChange={setWeekDays}
              >
                {days.map(day => (
                  <ToggleGroup.Item
                    key={day.value}
                    value={day.value}
                    title={day.title}
                    className={`w-8 h-8 rounded ${weekDays.includes(day.value) ? 'bg-violet-500' : 'bg-zinc-900'}`}
                  >
                    {day.title[0]}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="hourStart">Qual horário do dia?</label>
              <div className="grid grid-cols-2 gap-2">
                <Input name="hourStart" id="hourStart" type="time" placeholder="De" />
                <Input name="hourEnd" id="hourEnd" type="time" placeholder="Até" />
              </div>
            </div>
          </div>

          <label className="mt-2 flex gap-2 items-center text-sm">
            <Checkbox.Root
              className="w-6 h-6 p-1 rounded bg-zinc-900"
              onCheckedChange={(checked) => {
                if(checked === true) {
                  setUseVoiceChannel(true)
                } else {
                  setUseVoiceChannel(false)
                }
              }}
              checked={useVoiceChannel}
            >
              <Checkbox.Indicator>
                <Check  className="w-4 h-4 text-emerald-400"/>
              </Checkbox.Indicator>
            </Checkbox.Root>
            Costumo me conectar ao chat de voz
          </label>

          <footer className="mt-4 flex justify-end gap-4">
            <Dialog.Close
              type="button"
              className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
            >
              Cancelar
            </Dialog.Close>
            <button
              type="submit"
              className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600"
            >
              <GameController className="w-6 h-6" />
              Encontrar duo
            </button>
          </footer>
        </form>
    </Dialog.Content>
  </Dialog.Portal>
  )
}