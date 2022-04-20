export const getThisState = (stateName: string) => {
  try{
    const serializedState = localStorage.getItem(stateName);
    if(serializedState === null){ return undefined }
    return JSON.parse(serializedState);
  }catch(err){
    return undefined
  }
}

export const getItem = (itemName: string) => {
  const items = getThisState(itemName)
  if (items === undefined) {
    return {candidates : []}
  } else {
    return items
  }
}

export const saveItem = (key: string,data: any) => {
  const serializedState = JSON.stringify(data);
  localStorage.setItem(key,serializedState);
}

export const getItemByKey = (key:string) => {
  try{
    const serializedState = localStorage.getItem(key);
    if(serializedState === null){ return undefined }
    return JSON.parse(serializedState);
  }catch(err){
    return undefined
  }
}

export const deleteItemByKey = (key:string) => localStorage.setItem(key,'')

export const emptyLocalStorage = (reducerkeys: string[]) => {

  try{
    if(undefined != reducerkeys && reducerkeys.length > 0){
      reducerkeys.forEach(key => {
        localStorage.setItem(key,'');
      })
    }
  }catch(err){
    //console.log("ERROR===emptyLocalStorage==>>>")
  }
}

export const clearStorage = () => localStorage.clear();
