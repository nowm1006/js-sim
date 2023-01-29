import Plotly from 'plotly.js-basic-dist-min'
import { Block, Source, Sink } from './base'

type PlotProps = {
    name?: string
}

type Trace = {
    uid: number
    x: number[]
    y: number[]
    name: string
}

export class Plot extends Sink {
    static instances: Plot[] = []
    inputs: (Source | Block)[] = []
    data: Trace[] = []

    constructor({ name }: PlotProps = {}) {
        super({ name })
        Plot.instances.push(this)
    }

    connect(...inputs: (Source | Block)[]) {
        super.connect(...inputs)
        inputs.forEach((input) => {
            this.data.push({
                uid: input.uid,
                x: [],
                y: [],
                name: input.name,
            })
        })
    }

    get(t: number): void {
        this.inputs.forEach((input) => {
            const trace = this.data.find((trace) => {
                return trace.uid == input.uid
            })
            if (trace) {
                trace.x.push(t)
                trace.y.push(input.get(t))
            }
        })
    }

    plot() {
        const div = document.body.appendChild(document.createElement('div'))
        const layout: Partial<Plotly.Layout> = {
            title: this.name,
            xaxis: {
                title: 'time[sec]',
            },
        }

        Plotly.newPlot(div, this.data, layout)
    }
}
