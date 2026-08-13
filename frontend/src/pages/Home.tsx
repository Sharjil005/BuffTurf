import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PitchDivider from '../components/ui/PitchDivider';

const sports = ['Cricket', 'Football', 'Badminton', 'Basketball', 'Volleyball', 'Tennis'];

const stats = [
  { label: 'Turfs Listed', value: '500+' },
  { label: 'Cities', value: '12' },
  { label: 'Bookings Made', value: '10K+' },
];

const steps = [
  { title: 'Find your ground', desc: 'Search by sport, location, and price to find the right turf.' },
  { title: 'Pick a slot', desc: 'See live availability and choose a date and time that works.' },
  { title: 'Book and play', desc: 'Confirm your slot, pay securely, and show up ready to play.' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-turf-900 px-4 py-24 text-chalk-50">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="font-display text-6xl uppercase leading-none tracking-wide sm:text-7xl">
            Your Ground.
            <br />
            <span className="text-pitch-500">Your Time.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-chalk-50/70">
            Book cricket, football, badminton, and more — nearby turfs, real-time slots, zero hassle.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button variant="accent">Find a Turf</Button>
            <Button variant="secondary">List Your Turf</Button>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-3xl flex-wrap justify-center gap-x-12 gap-y-4 border-t border-chalk-50/10 pt-8 font-mono text-sm uppercase tracking-widest text-chalk-50/60">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-semibold text-amber-500">{s.value}</div>
              <div>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sports */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="font-display text-3xl uppercase tracking-wide text-ink-900">Sports We Cover</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {sports.map((sport) => (
            <Badge key={sport}>{sport}</Badge>
          ))}
        </div>
      </section>

      <PitchDivider />

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center font-display text-3xl uppercase tracking-wide text-ink-900">
          How It Works
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <Card key={step.title}>
              <div className="font-mono text-sm text-pitch-500">0{i + 1}</div>
              <h3 className="mt-2 text-lg font-semibold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-900/60">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}