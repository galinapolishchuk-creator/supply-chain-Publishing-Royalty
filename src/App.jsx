import { Fragment, useState } from 'react'
import { works } from './data'

const accents = { A: '#E5484D', B: '#30A46C', C: '#3E63DD' }
// Writer palette deliberately kept OUT of the Work (red/green/blue) and
// Agreement (green/brown) hue families, so the % colour links read clearly.
const writerColors = {
  'Writer A': '#7C3AED', // violet
  'Writer B': '#0891B2', // cyan
  'Writer C': '#DB2777', // magenta
  'Writer D': '#EA580C', // orange
}
const publisherColors = { 'Publisher ABC': '#1F6FB2', 'Publisher XYZ': '#B2521F' }
const publisherBg = { 'Publisher ABC': '#E9F1F8', 'Publisher XYZ': '#F8EEE9' }
const agreementColors = { '001': '#3E7D2E', '002': '#8A5A1F' }

const money = (n) => '$' + n.toFixed(2)
const uniq = (a) => [...new Set(a)]

// One fixed column set for BOTH views. Percentage columns stay in place;
// they are simply empty in Summary and filled with chips in Breakdown.
const COLS = [
  { key: 'writer', label: 'Writer', w: 160, kind: 'writer' },
  { key: 'split', label: 'Split %', w: 84, kind: 'pct', field: 'split', colorBy: 'work' },
  { key: 'gross', label: 'Gross', w: 110, kind: 'num', field: 'gross', total: 'gross' },
  { key: 'ws', label: 'Writer Share %', w: 116, kind: 'pct', field: 'writerShare', colorBy: 'agreement' },
  { key: 'net', label: "Writers' Net", w: 120, kind: 'num', field: 'net', total: 'net' },
  { key: 'pub', label: '', w: 150, kind: 'publisher' },
  { key: 'pshare', label: 'Pub. Share %', w: 110, kind: 'pct', field: 'pubShare', colorBy: 'agreement' },
  { key: 'pnet', label: 'Publisher Net', w: 120, kind: 'num', field: 'pub', total: 'pub' },
]
const TEMPLATE = COLS.map((c) => c.w + 'px').join(' ')
const PUB_INDEX = COLS.findIndex((c) => c.kind === 'publisher')

function Filter({ label, value, onChange, options }) {
  return (
    <label className="filter">
      <span className="filter-label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="all">All</option>
        {options.map(([val, lab]) => (
          <option key={val} value={val}>{lab}</option>
        ))}
      </select>
    </label>
  )
}

function ColHead({ view }) {
  return (
    <div className="colhead">
      <div className="ch-spacer" />
      <div className="ch-grid" style={{ gridTemplateColumns: TEMPLATE }}>
        {COLS.map((c, ci) => {
          // % columns are empty in Summary — hide their labels there
          const showLabel = c.kind !== 'pct' || view === 'breakdown'
          return (
            <div key={c.key} className={'ch ' + c.kind} style={{ gridColumn: ci + 1 }}>
              {showLabel ? c.label : ''}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WorkCard({ work, view }) {
  const accent = accents[work.id] || '#6b7280'
  const agr = agreementColors[work.agreement] || '#6b7280'
  const pubColor = publisherColors[work.publisher] || '#6b7280'
  const pubBg = publisherBg[work.publisher] || '#eef1f5'
  const n = work.writers.length
  const tot = work.writers.reduce(
    (a, w) => ({ gross: a.gross + w.gross, net: a.net + w.net, pub: a.pub + w.pub }),
    { gross: 0, net: 0, pub: 0 }
  )

  return (
    <section className="card" style={{ borderLeftColor: accent }}>
      <div className="panel">
        <div className="workbadge" style={{ background: accent + '22', color: accent }}>{work.name}</div>
        <div className="amount">{money(tot.gross)}</div>
        <div className="agreement" style={{ background: agr + '22', color: agr }}>Agreement {work.agreement}</div>
        <div className="wcount">{n} writers</div>
      </div>

      <div className="body" style={{ gridTemplateColumns: TEMPLATE }}>
        {/* totals row */}
        {COLS.map((c, ci) => (
          <div key={'t-' + c.key} className={'tcell' + (c.kind === 'num' ? ' num' : '')} style={{ gridColumn: ci + 1, gridRow: 1 }}>
            {c.total ? money(tot[c.total]) : ''}
          </div>
        ))}

        {/* writer cards */}
        {work.writers.map((wr, r) => (
          <Fragment key={wr.name}>
            <div className="wcardbg" style={{ gridColumn: '1 / -1', gridRow: r + 2 }} />
            {COLS.map((c, ci) => {
              if (c.kind === 'publisher') return null
              const style = { gridColumn: ci + 1, gridRow: r + 2 }
              if (c.kind === 'writer')
                return (
                  <div key={c.key} className="cell writer" style={style}>
                    <span className="wbar" style={{ background: writerColors[wr.name] }}>{wr.name}</span>
                  </div>
                )
              if (c.kind === 'pct') {
                if (view !== 'breakdown') return <div key={c.key} className="cell" style={style} />
                const col = c.colorBy === 'work' ? accent : agr
                return (
                  <div key={c.key} className="cell pctcell" style={style}>
                    <span className="chip" style={{ background: col + '26', color: col }}>{wr[c.field]}%</span>
                  </div>
                )
              }
              return <div key={c.key} className="cell num" style={style}>{money(wr[c.field])}</div>
            })}
          </Fragment>
        ))}

        {/* one shared publisher block, spanning the writer cards */}
        <div className="publisher" style={{ gridColumn: PUB_INDEX + 1, gridRow: `2 / span ${n}`, background: pubBg, color: pubColor }}>
          {work.publisher}
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [view, setView] = useState('summary')
  const [fWork, setFWork] = useState('all')
  const [fWriter, setFWriter] = useState('all')
  const [fPublisher, setFPublisher] = useState('all')
  const [fAgreement, setFAgreement] = useState('all')

  const writerOpts = uniq(works.flatMap((w) => w.writers.map((x) => x.name))).sort()
  const publisherOpts = uniq(works.map((w) => w.publisher))
  const agreementOpts = uniq(works.map((w) => w.agreement))

  const visible = works.filter(
    (w) =>
      (fWork === 'all' || w.id === fWork) &&
      (fWriter === 'all' || w.writers.some((x) => x.name === fWriter)) &&
      (fPublisher === 'all' || w.publisher === fPublisher) &&
      (fAgreement === 'all' || w.agreement === fAgreement)
  )

  const anyFilter = fWork !== 'all' || fWriter !== 'all' || fPublisher !== 'all' || fAgreement !== 'all'
  const reset = () => { setFWork('all'); setFWriter('all'); setFPublisher('all'); setFAgreement('all') }

  return (
    <div className="page">
      <header className="head">
        <h1>Publishing Royalty Breakdown</h1>
        <p>A detailed view of how publishing earnings are calculated and distributed.</p>
      </header>

      <div className="filters">
        <Filter label="Work" value={fWork} onChange={setFWork} options={works.map((w) => [w.id, w.name])} />
        <Filter label="Writer" value={fWriter} onChange={setFWriter} options={writerOpts.map((x) => [x, x])} />
        <Filter label="Publisher" value={fPublisher} onChange={setFPublisher} options={publisherOpts.map((x) => [x, x])} />
        <Filter label="Agreement" value={fAgreement} onChange={setFAgreement} options={agreementOpts.map((x) => [x, 'Agreement ' + x])} />
        {anyFilter && <button className="reset" onClick={reset}>Reset filters</button>}
      </div>

      <div className="subbar">
        <div className="summary">
          <div className="stat"><div className="stat-value">$850.00</div><div className="stat-label">GROSS</div></div>
          <div className="stat"><div className="stat-value">$662.50</div><div className="stat-label">WRITERS' NET</div></div>
          <div className="stat"><div className="stat-value">$187.50</div><div className="stat-label">PUBLISHER NET</div></div>
        </div>
        <div className="seg" role="tablist">
          <button className={view === 'summary' ? 'on' : ''} onClick={() => setView('summary')}>Summary</button>
          <button className={view === 'breakdown' ? 'on' : ''} onClick={() => setView('breakdown')}>Breakdown</button>
        </div>
      </div>

      <div className="scroll">
        <ColHead view={view} />
        {visible.length === 0 ? (
          <div className="empty">No works match the selected filters.</div>
        ) : (
          <div className="cards">
            {visible.map((w) => <WorkCard key={w.id} work={w} view={view} />)}
          </div>
        )}
      </div>

      <p className="note">
        {visible.length} of {works.length} works shown · columns stay fixed; <b>Breakdown</b> fills the % columns · per-work totals are the row above each work's writers.
      </p>
    </div>
  )
}
