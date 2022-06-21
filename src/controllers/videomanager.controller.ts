import {spawn} from 'child_process'

const convertFilesWebmToMp4 = (sourceVideo: any, outputVideo: any) => new Promise((resolve, reject)=> {
    let options = {
        shell: true
    }

    let args = ['-fflags', '+genpts','-y', '-i', `"${sourceVideo}"`, '-r', '24', `"${outputVideo}"`]
    
    const child = spawn('ffmpeg', args, options)

    
    child.stdout.on('data', (data: any)=> {
        console.log(`Output: ${data}`)
    })

    child.stderr.on('data', (data: string)=> {
        console.log("child.stderr.on data ",data)
        if(data.includes('Error')){
            reject('Error al procesar el comando')
        }
    })


    child.on('close', (code)=> {
        console.log(`child process exited with code ${code}`);
        resolve(code)
    })
})

class VIDEOMANAGER{ 

    async changeFormatVideo(sourceVideo: any, outputVideo: any): Promise<string>{
        try {
            await convertFilesWebmToMp4(sourceVideo, outputVideo)            
            return outputVideo
        } catch (error) {
            console.error(error)
        }
    }
}

export default new VIDEOMANAGER()