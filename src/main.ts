import { Step, Const } from './blocks/sources'
import { FirstOrderDelay, MassDamper, Integrate, Gain, Sum } from './blocks/blocks'
import { Plot } from './blocks/sinks'
import { simulate } from './blocks/runner'
import { Vec2 } from './libs/utils'

const step = new Step({ name: 'Step', tStep: 1 })
const d1 = new FirstOrderDelay({ name: 'T=1', T: 1 })
const d2 = new FirstOrderDelay({ name: 'T=2', T: 2 })
const c = new Const({ name: 'zero', value: 0 })
const md = new MassDamper({ name: 'mass-damper', x0: new Vec2(0, 0), m: 1 })
const plot = new Plot({ name: 'First Order Delay' })

d1.connect(step)
d2.connect(step)
md.connect(step)

const i1 = new Integrate({})
const i2 = new Integrate({ name: 'block model' })
const g1 = new Gain({ K: -1 })
const g2 = new Gain({ K: -1 })
const sum = new Sum()

sum.connect(step, g1, g2)
i1.connect(sum)
i2.connect(i1)
g1.connect(i1)
g2.connect(i2)

plot.connect(step, d1, d2, md, i2)

simulate(20, 0.1)
