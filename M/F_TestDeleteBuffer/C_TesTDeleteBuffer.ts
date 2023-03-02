export type StepData = {
    step: number
    time: number
    after: {
        unit: string
        step: number
    }
}


type RawData = {
    [Unit: string]: StepData[]
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
                step: 4
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

function genResultTable(unit: string, step: StepData, start: number, end: number) {
    if (result[unit]) {
        result[unit] = [
            ...result[unit],
            {
                step: step.step,
                time: [start, end],
            }
        ]

    }
    else {
        result[unit] = [
            {
                step: step.step,
                time: [start, end],
            },
        ]
    }

}


//Condition for Create or Add to (endStepTime )
function genEndStepTime(unit: string, step: StepData, start: number, end: number) {
    if (endStepTime[unit]) {
        endStepTime[unit][step.step] = end
    }
    //สร้างใหม่ 
    else {
        endStepTime[unit] = { [step.step]: end }
    }
}


//loop1 วนทุกๆ Unit ใน table mixTable
for (const [unit, steps] of Object.entries(mixTable)) {
    //loop2 loopในเเต่ละ Unit

    steps.forEach((step) => {


        const { unit: after_unit, step: after_step } = step.after
        // ทำให้ beforTime เป้น 0 หากยังไม่มีข้อมูลของ step นั้น
        if (after_unit) {
            if (step.after.step !== 0) {
                let pushFlag = true

                if (endStepTime[after_unit]) {
                    if (endStepTime[after_unit][after_step]) {
                        beforeTime = endStepTime[after_unit][after_step] || 0
                        pushFlag = false

                    }

                }

                if (pushFlag) {
                    buffer.push({
                        unit: unit,
                        step: step.step,
                        time: step.time,
                        after: {
                            unit: step.after.unit,
                            step: step.after.step,
                        }
                    })
                }
               
            }
            else {
                beforeTime = 0
              
            }
        }

        const start = beforeTime
        const end = Math.round((start + step.time) * 10) / 10


       
        //Test Step1 pass
        if (endStepTime[step.after.unit]) {
           

            var testStep1 = step.after.unit
            var testStep2 = step.after.step

            //Test Step1.2
            if (endStepTime[testStep1][testStep2]) {
                genResultTable(unit, step, start, end)
                genEndStepTime(unit, step, start, end)
                
            }
            else {

                
            }

        }

        else {
            //Test Step1
            
            //Test Step1.1
            if (unit == step.after.unit) {
                
                //Test Step1.1.1
                if (step.after.step == 0) {
                    genResultTable(unit, step, start, end)
                    genEndStepTime(unit, step, start, end)
                    
                }
                else {
                   
                }
                // if () {}
            }
            else {}
            // if (step.after.unit) {}
        }



        //Set beforetime for next step 
        beforeTime = end

    }
    )
}

var bufferIndex:number  = 0
//bufferStep is element in Array (element type => object)
buffer.forEach((bufferStep, index, arr) => {
    //Find start Buffer time from endStepTime Table

    var startBuffer = endStepTime[bufferStep.after.unit][bufferStep.after.step]
    var endBuffer = Math.round((startBuffer + bufferStep.time) * 10) / 10
   console.log("bufferIndex",bufferIndex)
    const bufferReFormat = {
        step: bufferStep.step,
        time: bufferStep.time,
        after: bufferStep.after
    }

    console.log("bufferReFormat", bufferReFormat, buffer.length)
    console.log("startbuffer", startBuffer)
    console.log("endBuffer", endBuffer)
    console.log("NowBuffer", bufferStep.unit, bufferStep.step)
    console.log("Buffer[0]",buffer[0])
    //Test 2 (after unit)
    if (endStepTime[bufferStep.after.unit]) {
        console.log("Test 2 pass")
        //Test 2.1 after.unit + after.step
        if (endStepTime[bufferStep.after.unit][bufferStep.after.step]) {
            console.log("2.1 pass")
            //Test 2.3 ใน resulttable.unit 
            if (
                result[bufferStep.unit]) {
                console.log("add to result")
                result[bufferStep.unit] = [
                    ...result[bufferStep.unit],
                    {
                        step: bufferStep.step,
                        time: [startBuffer, endBuffer],
                    }
                ]
                genEndStepTime(bufferStep.unit, bufferReFormat, startBuffer, endBuffer)
                console.log("result after ", result)
                console.log("genEndStep ", endStepTime)
                buffer.splice(bufferIndex,1)
                bufferIndex--
            }
            else {
                console.log("Create result")

                result[bufferStep.unit] = [
                    {
                        step: bufferStep.step,
                        time: [startBuffer, endBuffer],
                    },


                ]
                genEndStepTime(bufferStep.unit, bufferReFormat, startBuffer, endBuffer)
                console.log("result after ", result)
                console.log("genEndStep ", endStepTime)
                buffer.splice(bufferIndex,1)
                bufferIndex--
            }
            // for(var i=0 ; i < buffer.length; i++){
            //     if (buffer[i] = index){}
            // }
        }
    }

    bufferIndex++
    console.log("buffer after deleta",buffer)
}

)


