// let database = {
//   "0.jpeg": { meta: null },
//   "1.png": { meta: null },
//   "2.png": { meta: null },
//   "3.jpg": { meta: null },
//   "4.jpg": { meta: null },
//   "5.png": { meta: null },
//   "6.png": { meta: null },
//   "7.jpg": { meta: null },
//   "8.jpg": { meta: null },
//   "9.jpg": { meta: null },
//   "10.jpg": { meta: null },
//   "11.jpg": { meta: null },
// };

let categories = ['one', 'two', 'three', 'four']

export async function listImages() {
  let res = await fetch('/img')
  let images = await res.json()
  return images
}

export async function getImageData(path) {
  let res = await fetch('/data/' + encodeURI(path))
  if (res.status !== 200) {
    return {}
  }
  let data = res.json()
  return data
}

export async function postImageData(path, data) {
  let res = await fetch('/data/' + encodeURI(path), {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (res.status < 200 || res.status > 299) {
    throw new Error(await res.text())
  }
  return 
}

// export async function getImage(path) {
//   return fetch("/img/" + path).then(response => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.blob();
//   });
// }

export async function getCategories() {
  return categories
}