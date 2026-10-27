
import { useState } from 'react'
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="page">
      <nav>
        <a className="logo" href="#">MON SITE.</a>
        <a href="#contact">Contact ↗</a>
      </nav>

      <section className="hero">
        <p className="eyebrow">BIENVENUE SUR MON UNIVERS</p>
        <h1>
          Des idées
          <br />
          <span>qui prennent vie.</span>
        </h1>
        <p className="description">
          Mon espace personnel sur Internet.
          Un site créé sur mesure, par moi.
        </p>

        <a className="button" href="#contact">
          Découvrir mon projet ↗
        </a>
      </section>

      <section className="counter">
        <h2>Une première interaction</h2>
        <p>Tu as cliqué {count} fois.</p>
        <button onClick={() => setCount(count + 1)}>
          Clique ici ✨
        </button>
      </section>

      <footer id="contact">
        Créé avec React · Mon site personnel
      </footer>
    </main>
  )
}