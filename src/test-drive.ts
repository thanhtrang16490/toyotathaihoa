export const testDriveTimes = Array.from({length:20},(_,index)=>{
  const hour = String(8+Math.floor(index/2)).padStart(2,'0')
  return hour+(index%2===0 ? ':00' : ':30')
})

export function todayInVietnam() {
  return new Intl.DateTimeFormat('sv-SE',{
    timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit',
  }).format()
}
