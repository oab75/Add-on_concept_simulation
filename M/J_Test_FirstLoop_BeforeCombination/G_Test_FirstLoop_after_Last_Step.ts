type StepData = {
    step: number
    time: number
    after: {
        unit: string
        step: number
    }
    before:{
        unit: string 
        step: number
    }
    type: string
}


type RawData = {
    [Unit: string]: StepData[]
}


//รวม Table ของ M/C เเละ OP ใน SQL ได้ผลลัพธ์ตามตารางนี้ 
const mixTable: RawData = {
     "OP1": [
        {
            step: 1, time: 1.75, after: {
                unit: "OP1",
                step: 1
            },
            before: {unit: "OP1" ,step: 2 },
            type: "first",
        },
        {
            step: 2, time: 2, after: {
                unit: "OP1",
                step: 1
            },
            before: {unit: "OP1",step: 3 },
            type: "normal",
        },
        {
            step: 3, time: 2.5, after: {
                unit: "OP1",
                step: 2
            },
            before: {unit: "OP1",step: 4 },
            type: "normal",
        },
        {
            step: 4, time: 1.5, after: {
                unit: "MC1",
                step: 1
            },
            before: {unit: "OP1",step: 5 },
            type: "normal",
        },
        {
            step: 5, time: 0.75, after: {
                unit: "OP1",
                step: 4
            },
            before: {unit: "OP1",step: 5 },
            type: "normal",
        },
    ],

    "MC1": [
        {
            step: 1, time: 10, after: {
                unit: "OP1",
                step: 5
            },
            before: {unit: "OP1",step: 5 },
            type: "normal",
        }
    ],

    "OP2": [
        {
            step: 1, time: 1.75, after: {
                unit: "MC2",
                step: 1
            },
            before: {unit: "OP1",step: 5 },
            type: "first",
        },
        {
            step: 2, time: 1.75, after: {
                unit: "MC1",
                step: 1
            },
            before: {unit: "OP1",step: 5 },
            type: "normal",
        },
        {
            step: 3, time: 0.75, after: {
                unit: "OP2",
                step: 2
            },
            before: {unit: "OP1",step: 5 },
            type: "normal",
        },
    ],
    "MC2": [
        {
            step: 1, time:6, after: {
                unit: "OP2",
                step: 3
            },
            before: {unit: "OP1",step: 5 },
            type: "normal",
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
    before: {
        unit: string
        step: number
    }
    type: string
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
        
        console.log("step.type", step.type)

        const { unit: after_unit, step: after_step } = step.after
        // ทำให้ beforTime เป้น 0 หากยังไม่มีข้อมูลของ step นั้น
          
      
            console.log("after_unit",after_unit)
       // test 1
            if ((step.after.step !== 0)&&(step.type !== "first")) {
                console.log ("Test Resulttttttttttttttt",step.after.step,step.type)
                var testtt = (step.after.step !== 0)&&(step.type !== "first")
                console.log("testtt",testtt)
                let pushFlag = true

                // test1.2
                if (endStepTime[after_unit]) {
                    // testStep1.2.1
                    if (endStepTime[after_unit][after_step]) {
                        console.log("endStepTime",endStepTime)
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
                        },
                        before: {
                            unit: step.before.unit,
                            step: step.before.step,
                        },
                        type: step.type
                    })
                }

            }
            // else if  (step.type == "first") {
            //     console.log("Firsttttttttt")
            //     beforeTime = 0
            // }
            else {
                console.log("Firsttttttttt")
                console.log("EndSteptime",endStepTime[after_unit])
                beforeTime = 0
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
console.log("bufferlenght",buffer.length)
const firstLoopLenght = buffer.length

var bufferIndex = 0
//bufferStep is element in Array (element type => object)

var conntWhile = 0 
var bufferContinueLoop = 1
while( bufferContinueLoop >= 1){
   
    var bufferLenghtBefore = buffer.length

for (let bufferIndex = 0; bufferIndex < buffer.length; bufferIndex++) {

    var startBuffer = 9999999
    var endBuffer = 9999999
 

    if (endStepTime[buffer[bufferIndex].after.unit]) {
        if (endStepTime[buffer[bufferIndex].after.unit][buffer[bufferIndex].after.step]) {
            var startBuffer = endStepTime[buffer[bufferIndex].after.unit][buffer[bufferIndex].after.step]
            var endBuffer = Math.round((startBuffer + buffer[bufferIndex].time) * 10) / 10
        }
    }

    const bufferReFormat = {
        step: buffer[bufferIndex].step,
        time: buffer[bufferIndex].time,
        after: buffer[bufferIndex].after,
        before: buffer[bufferIndex].before,
        type: buffer[bufferIndex].type,
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
            }
        }
    }
    else {
        // if for test first loop
        // if (buffer){} 
    
        console.log("fail No after data ")
        console.log(buffer[bufferIndex])
    }
}
conntWhile++
var bufferLenghtafter = buffer.length
if (bufferLenghtBefore == bufferLenghtafter) {
    bufferContinueLoop = 0
    console.log("End Loop of buffer(all element) ","bufferContinueLoop",bufferContinueLoop)
}
}

console.log(buffer);

