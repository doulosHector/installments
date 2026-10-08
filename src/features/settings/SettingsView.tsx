import { CurrencyCard } from './components/CurrencyCard'
import { DataCard } from './components/DataCard'
import { ThemeCard } from './components/ThemeCard'
import { WipeCard } from './components/WipeCard'
import './settings.css'

export function SettingsView() {
  return (
    <>
      <div className="sync">
        <i />
        <span>Saved on this device.</span>
      </div>
      <ThemeCard />
      <CurrencyCard />
      <DataCard />
      <WipeCard />
    </>
  )
}
