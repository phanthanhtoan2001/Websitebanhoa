export async function ImagetoBase64(file){
    const reader = new FileReader()
    reader.readAsDataURL(file)

    //Tạo một Promise và trả về Promise đó
    const data = new Promise((resolve,reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = err => reject(err)
    })

    //Trả về Promise đã tạo
    return data
}
