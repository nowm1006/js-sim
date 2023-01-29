import { Sink } from './base'
import { Plot } from './sinks'

export function simulate(tend: number, dt: number) {
    for (let t = 0; t <= tend; t += dt) {
        Sink.instances.forEach((instance) => {
            instance.get(t)
        })
    }

    Plot.instances.forEach((p) => p.plot())
}
