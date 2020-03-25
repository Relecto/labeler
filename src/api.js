let database = {
  "0.jpeg": { meta: null },
  "1.png": { meta: null },
  "2.png": { meta: null },
  "3.jpg": { meta: null },
  "4.jpg": { meta: null },
  "5.png": { meta: null },
  "6.png": { meta: null },
  "7.jpg": { meta: null },
  "8.jpg": { meta: null },
  "9.jpg": { meta: null },
  "10.jpg": { meta: null },
  "11.jpg": { meta: null },
};

let categories = ['one', 'two', 'three', 'four']

export async function listImages() {
  return Object.keys(database);
}

export async function getImageData(path) {
  return database[path]
}

export async function postImageData(path, data) {
  database[path] = data
}

export async function getImage(path) {
  return fetch("/img/" + path).then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.blob();
  });
}

export async function getCategories() {
  return categories
}