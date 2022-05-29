function storageFactory(storage: Storage) {
  function clear() {
    storage.clear()
  }

  function getItem(name: string) {
    return JSON.parse(storage.getItem(name) as string)
  }

  function removeItem(name: string) {
    storage.removeItem(name)
  }

  function setItem(name: string, value: any) {
    storage.setItem(name, JSON.stringify(value))
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear
  }
}

export const localStore = storageFactory(localStorage)
export const sessionStore = storageFactory(sessionStorage)
