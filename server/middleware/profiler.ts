import * as profiler from 'v8-profiler'
import * as fs from 'fs'

export default async function profilerTrace (ctx: any, next: () => Promise<any>)  {
  const duration = 30
  profiler.startProfiling('profile sample')
  setTimeout(() => {
    const profileData = profiler.stopProfiling()
    console.log(profileData.getHeader())
    profileData.export((err, result) => {
      if (err) {
          console.log(err)
      } else {
        fs.writeFileSync('profileData.cpuprofile', result)
        console.log('Dumping data done')
      }
      profileData.delete()
   })
  }, duration * 1000)
  next()
}
