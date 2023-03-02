"use strict";
const operators = {
    "OP1": [
        {
            step: 1, time: 3, after: {
                op: "OP1",
                step: 0
            }
        },
        {
            step: 2, time: 1, after: {
                op: "OP1",
                step: 1
            }
        },
        {
            step: 3, time: 0.5, after: {
                op: "OP1",
                step: 2
            }
        },
        {
            step: 4, time: 2.3, after: {
                op: "OP1",
                step: 3
            }
        }
    ],
    "OP2": [
        {
            step: 1, time: 1, after: {
                op: "OP1",
                step: 3
            }
        },
        {
            step: 2, time: 1.5, after: {
                op: "OP2",
                step: 1
            }
        },
        {
            step: 3, time: 3.4, after: {
                op: "OP2",
                step: 2
            }
        },
        {
            step: 4, time: 1.7, after: {
                op: "OP2",
                step: 3
            }
        }
    ]
};
const machines = {
    "MC1": [
        {
            step: 1,
            time: 4,
            after: {
                mc: "MC1",
                step: 0
            }
        },
        {
            step: 2,
            time: 12,
            after: {
                mc: "MC1",
                step: 1
            }
        },
        {
            step: 3,
            time: 3,
            after: {
                mc: "MC1",
                step: 2
            }
        },
    ],
    "MC2": [
        {
            step: 1,
            time: 3,
            after: {
                mc: "MC2",
                step: 0
            }
        }
    ],
    "MC3": [
        {
            step: 1,
            time: 7,
            after: {
                mc: "MC1",
                step: 1
            }
        },
        {
            step: 2,
            time: 6,
            after: {
                mc: "MC3",
                step: 1
            }
        }
    ],
    "MC4": [
        {
            step: 1,
            time: 4,
            after: {
                op: "OP1",
                step: 3
            }
        }
    ]
};
var beforeTime = 0;
var endStepTime = {};
var result = {};
for (const [op, steps] of Object.entries(operators)) {
    // loop each OP
    // console.log(`${key}: ${value}`);
    steps.forEach(function (step) {
        const { op: _op, step: _step } = step.after;
        if (_op) {
            beforeTime = endStepTime[_op] ? endStepTime[_op][_step] || 0 : 0;
        }
        // loop each step of OP
        console.log(step);
        const start = beforeTime;
        const end = Math.round((start + step.time) * 10) / 10;
        // result[key] have data/ not have = undefined/null = false
        if (result[op]) {
            result[op] = [
                ...result[op],
                {
                    step: step.step,
                    time: [start, end],
                }
            ];
        }
        else {
            result[op] = [
                {
                    step: step.step,
                    time: [start, end],
                }
            ];
        }
        // check after
        if (endStepTime[op]) {
            endStepTime[op][step.step] = end;
        }
        else {
            endStepTime[op] = { [step.step]: end };
        }
        beforeTime = end;
    });
    console.log(endStepTime);
}
console.log(result);
var beforeTimeMc = 0;
var resultMc = {};
var endStepTimeMc = {};
for (const [mc, steps] of Object.entries(machines)) {
    //loop for each mc 
    steps.forEach(function (step) {
        const { mc: _mc, op: _op, step: _step } = step.after;
        if (_mc) {
            beforeTimeMc = endStepTimeMc[_mc] ? endStepTimeMc[_mc][_step] || 0 : 0;
        }
        //loop each step of Mc
        console.log(step);
        const start = beforeTimeMc;
        const end = Math.round((start + step.time) * 10) / 10;
        if (resultMc[mc]) {
            resultMc[mc] = [
                ...resultMc[mc],
                {
                    step: step.step,
                    time: [start, end],
                }
            ];
        }
        else {
            resultMc[mc] = [
                {
                    step: step.step,
                    time: [start, end],
                },
            ];
        }
        //check after 
        if (endStepTimeMc[mc]) {
            endStepTimeMc[mc][step.step] = end;
        }
        else {
            endStepTimeMc[mc] = { [step.step]: end };
        }
        beforeTimeMc = end;
    });
    console.log(endStepTimeMc);
}
console.log(resultMc);
/* result = {
    "OP1": [
        {
            step:1,
            time: [0,3]
        },
        {
            step:2,
            time: [3,4]
        },
        {
            step:3,
            time: [4,4.5]
        },
        {
            step:4,
            time: [4.5,6.8]
        },
    ],
    "OP2": [
        {
            step:1,
            time: [4.5,5.5]
        },
        {
            step:2,
            time: [5.5,7]
        },
        {
            step:3,
            time: [7,10.4]
        },
        {
            step:4,
            time: [10.4,12.1]
        },
    ]

}
*/ 
