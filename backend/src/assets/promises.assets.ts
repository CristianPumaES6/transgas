export function DummyPromise(): Promise<boolean> {
    // Devuelvo promesa dummy que siempre resuelve true
    return new Promise(function (resolve, reject) {
        resolve(true);
    });
}