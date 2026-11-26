// Timeline coordinates are elapsed visible seconds. The evaluator is pure and
// deliberately holds both endpoints; smootherstep has zero speed and jerk-free acceleration at each joint.
const OUT=1.35, HIGH=.58, BACK=1.47, LOW=.46;
const PERIOD=OUT+HIGH+BACK+LOW;
const ease=x=>{const u=Math.max(0,Math.min(1,x));return u*u*u*(u*(u*6-15)+10);};
function cyclePose(cursor){
 if(cursor<=OUT)return {v:ease(cursor/OUT),stage:'outbound'};
 if(cursor<=OUT+HIGH)return {v:1,stage:'active'};
 if(cursor<OUT+HIGH+BACK)return {v:1-ease((cursor-OUT-HIGH)/BACK),stage:'returning'};
 return {v:0,stage:'resting'};
}
