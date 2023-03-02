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
            step: 4, time: 2.8, after: {
                unit: "OP1",
                step: 3
            }
        },
        {
            step: 5, time: 2, after: {
                unit: "OP1",
                step: 4
            }
        },
        {
            step: 6, time: 2, after: {
                unit: "OP1",
                step: 5
            }
        }
    ],

    "MC1": [
        {
            step: 1, time: 10, after: {
                unit: "OP1",
                step: 5
            }
        }
    ],

    "OP2": [
        {
            step: 1, time: 2, after: {
                unit: "OP2",
                step: 0
            }
        },
        {
            step: 2, time: 2.2, after: {
                unit: "MC1",
                step: 1
            }
        },
        {
            step: 3, time: 4, after: {
                unit: "OP2",
                step: 2
            }
        },
        {
            step: 4, time: 3, after: {
                unit: "OP2",
                step: 3
            }
        },
        {
            step: 5, time: 2, after: {
                unit: "OP2",
                step: 4
            }
        },

    ],
    "MC2": [
        {
            step: 1, time: 15, after: {
                unit: "OP2",
                step: 5
            }
        }
    ],
    "OP3": [
        {
            step: 1, time: 4, after: {
                unit: "MC2",
                step: 1
            }
        },
        {
            step: 2, time: 2, after: {
                unit: "OP3",
                step: 1
            }
        },
        {
            step: 3, time: 1, after: {
                unit: "OP3",
                step: 2
            }
        },
        {
            step: 4, time: 3, after: {
                unit: "OP3",
                step: 3
            }
        },

        {
            step: 5, time: 2.5, after: {
                unit: "OP3",
                step: 4
            }
        },
    ],
    "MC3": [
        {
            step: 1, time: 12, after: {
                unit: "OP3",
                step: 4
            }
        }
    ],
    "OP4": [
        {
            step: 1, time: 4, after: {
                unit: "OP3",
                step: 4
            }
        },
        {
            step: 2, time: 2, after: {
                unit: "OP4",
                step: 1
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
            else { }
            // if (step.after.unit) {}
        }



        //Set beforetime for next step 
        beforeTime = end

    }
    )
console.log("result",result)
console.log("endStepTime",endStepTime)

}



console.log("start buffer", buffer)
var bufferIndex = 0
//bufferStep is element in Array (element type => object)

var conntWhile = 0 
var bufferContinueLoop = 1
while( bufferContinueLoop >= 1){
    console.log ("buffer",buffer,"         ",buffer.length)
    var bufferLenghtBefore = buffer.length
    console.log("bufferContinueLoop",bufferContinueLoop)

for (let bufferIndex = 0; bufferIndex < buffer.length; bufferIndex++) {
    console.log("bufferIndex start", bufferIndex)

    var startBuffer = 9999999
    var endBuffer = 9999999
 
    console.log("bufferLenghtBefore", bufferLenghtBefore)

    if (endStepTime[buffer[bufferIndex].after.unit]) {
        if (endStepTime[buffer[bufferIndex].after.unit][buffer[bufferIndex].after.step]) {
            var startBuffer = endStepTime[buffer[bufferIndex].after.unit][buffer[bufferIndex].after.step]
            var endBuffer = Math.round((startBuffer + buffer[bufferIndex].time) * 10) / 10
        }
    }

    const bufferReFormat = {
        step: buffer[bufferIndex].step,
        time: buffer[bufferIndex].time,
        after: buffer[bufferIndex].after
    }


    if (endStepTime[buffer[bufferIndex].after.unit]) {
        console.log("Test 2 pass")
        //Test 2.1 after.unit + after.step
        if (endStepTime[buffer[bufferIndex].after.unit][buffer[bufferIndex].after.step]) {
            console.log("2.1 pass")
            //Test 2.3 ใน resulttable.unit 
            if (
                result[buffer[bufferIndex].unit]) {
                console.log("add to result")
                result[buffer[bufferIndex].unit] = [
                    ...result[buffer[bufferIndex].unit],
                    {
                        step: buffer[bufferIndex].step,
                        time: [startBuffer, endBuffer],
                    }
                ]
                genEndStepTime(buffer[bufferIndex].unit, bufferReFormat, startBuffer, endBuffer)

                if (buffer[bufferIndex].step > 0) {
                    // Remove element
                    buffer.splice(bufferIndex, 1);
                    console.log(`Element at ${bufferIndex} removed. Length is  ${buffer.length}`);
                    // Important
                    bufferIndex--;
                }
                // console.log("Result table", result)
                // console.log("buffer table", buffer,)
                // console.log("endStepTime", endStepTime)



            }
            else {
                console.log("Create result")

                result[buffer[bufferIndex].unit] = [
                    {
                        step: buffer[bufferIndex].step,
                        time: [startBuffer, endBuffer],
                    },


                ]
                genEndStepTime(buffer[bufferIndex].unit, bufferReFormat, startBuffer, endBuffer)

                if (buffer[bufferIndex].step > 0) {
                    // Remove element
                    buffer.splice(bufferIndex, 1);
                    console.log(`Element at ${bufferIndex} removed. Length is  ${buffer.length}`);
                    // Important
                    bufferIndex--;
                }
                // console.log("Result table", result)
                // console.log("buffer table", buffer,)
                // console.log("endStepTime", endStepTime)
            }

        }
    }
    else {
        console.log("fail No after data ")
    }

    // if (bufferLenghtBefore == bufferLenghtafter) {
    //     bufferContinueLoop = false 
    //     console.log("End Loop of buffer(all element) ")
    // }
}
conntWhile++
var bufferLenghtafter = buffer.length
console.log ("buffer",buffer,"         ",buffer.length)
console.log("lenght",bufferLenghtBefore,bufferLenghtafter)
if (bufferLenghtBefore == bufferLenghtafter) {
    bufferContinueLoop = 0
    console.log("End Loop of buffer(all element) ","bufferContinueLoop",bufferContinueLoop)
}
}

console.log(buffer);
