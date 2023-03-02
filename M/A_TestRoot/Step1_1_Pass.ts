export type RawData = {
    [Unit: string]: {
        step: number
        time: number
        after: {
            unit: string
            step: number
        }
    }[]
}

//รวม Table ของ M/C เเละ OP ใน SQL ได้ผลลัพธ์ตามตารางนี้ 
const mixTable: RawData = {
    "OP1": [
        {
            step: 1, time: 3, after: {
                unit: "OP1",
                step: 0
            }
        },
        {
            step: 2, time: 1, after: {
                unit: "OP1",
                step: 1
            }
        },
        {
            step: 3, time: 0.5, after: {
                unit: "OP1",
                step: 2
            }
        },
        {
            step: 4, time: 2.3, after: {
                unit: "OP1",
                step: 3
            }
        }
    ],
    "OP2": [
        {
            step: 1, time: 1, after: {
                unit: "OP1",
                step: 3
            }
        },
        {
            step: 2, time: 1.5, after: {
                unit: "OP2",
                step: 1
            }
        },
        {
            step: 3, time: 3.4, after: {
                unit: "OP2",
                step: 2
            }
        },
        {
            step: 4, time: 1.7, after: {
                unit: "OP2",
                step: 3
            }
        },
        {
            step: 5, time: 1, after: {
                unit: "OP2",
                step: 6
            }
        }
    ],
    "OP3": [
        {
            step: 1, time: 1, after: {
                unit: "MC1",
                step: 2
            }
        },
        {
            step: 2, time: 1.5, after: {
                unit: "OP3",
                step: 1
            }
        },


    ],


    "MC1": [
        {
            step: 1,
            time: 4,
            after: {
                unit: "MC1",
                step: 0
            }
        },
        {
            step: 2,
            time: 12,
            after: {
                unit: "MC1",
                step: 1
            }
        },
        {
            step: 3,
            time: 3,
            after: {
                unit: "MC1",
                step: 2
            }
        },
    ],
    "MC2": [
        {
            step: 1,
            time: 3,
            after: {
                unit: "MC2",
                step: 0
            }
        }
    ],
    "MC3": [
        {
            step: 1,
            time: 7,
            after: {
                unit: "MC1",
                step: 1
            }
        },
        {
            step: 2,
            time: 6,
            after: {
                unit: "MC3",
                step: 1
            }
        }
    ],
    "MC4": [
        {
            step: 1,
            time: 4,
            after: {
                unit: "OP1",
                step: 3
            }
        }
    ],

}

//กำหนดรูปเเบบตัวเก็บค่าข้อมูลใน loop 

// รูปเเบบ final result 
type ResultType = {
    [Unit: string]: { step: number, time?: number[] }[]
}

// ใช้เก็บข้อมูล เวลาจบ ของเเต่ละ Unit เพื่อใช้อ้างอิงเป้นเวลาเริ่มของ Unit.step ที่ต่อจากมัน

type EndStepType = {
    [Unit: string]: {
        [step: number]: number
    }
}

type Buffertype = {
    unit: string
    step: number
    time: number
    after: {
        unit: string
        step: number
    }

}[]

//กำหนดตัวเเปรตั้งต้นนอก loop1 (ตอนเริ่ม loop1 จะ มีค่าเป็น...)
var beforeTime = 0
var endStepTime: EndStepType = {}
var result: ResultType = {}
var buffer: Buffertype = []


//loop1 วนทุกๆ Unit ใน table mixTable
for (const [Unit, steps] of Object.entries(mixTable)) {
    //loop2 loopในเเต่ละ Unit
    steps.forEach((step) => {


        //Test Step1 pass
        if (endStepTime[step.after.unit]) {

            // console.log("Test End Step time Unit","Now",Unit,step.step,endStepTime[step.after.unit]) 
            console.log("Now", Unit, step.step)
            // console.log(endStepTime[step.after.step])
            // console.log(endStepTime)
            var testStep1 = step.after.unit
            var testStep2 = step.after.step
            console.log(step.after.unit)
            console.log(step.after.step)
            // console.log("TestStep",testStep)
            console.log(endStepTime[testStep1][testStep2])
            if (endStepTime[testStep1][testStep2]) {
                console.log("เพิ่ม result")
            }
            else { console.log("เพิ่ม Buffer") }

        }



        else {
            console.log("Test Undefined ref Unit before ", "Now", Unit, step.step)
            console.log("After Unit", step.after.unit)
            console.log("Now Unit", Unit)
            if (Unit == step.after.unit) { console.log("test step 0") }
            else { console.log("Unit ไม่ตรงกัน ทำBuffer") }
            // if (step.after.unit) {}
        }




        //กำหนดขื่อเรียกใน step.after ให้ชื่อไม่ซำ้กับตัวนอก after
        const { unit: _unit, step: _step } = step.after
        // ทำให้ beforTime เป้น 0 หากยังไม่มีข้อมูลของ step นั้น
        if (_unit) {
            if (step.after.step != 0 && step.after.unit) {
                beforeTime = endStepTime[_unit] ? endStepTime[_unit][_step] || 0 : buffer.push({
                    unit: Unit,
                    step: step.step,
                    time: step.time,
                    after: {
                        unit: step.after.unit,
                        step: step.after.step,
                    }
                })

            }
            else { beforeTime = 0 }

        }



        //เงื่อนไขเวลาเริ่มเเละเวลาจบ
        const start = beforeTime
        const end = Math.round((start + step.time) * 10) / 10
        if (result[Unit]) {
            result[Unit] = [
                ...result[Unit],
                {
                    step: step.step,
                    time: [start, end],
                }
            ]
        }

        else {
            result[Unit] = [
                {
                    step: step.step,
                    time: [start, end],
                },
            ]
        }

        if (endStepTime[Unit]) {
            endStepTime[Unit][step.step] = end
        }

        //สร้างใหม่ 
        else {
            endStepTime[Unit] = { [step.step]: end }
        }
        beforeTime = end
        console.log("endTimeStep after loop", endStepTime)
    }
    )
}


