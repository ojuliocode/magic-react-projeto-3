import { getDocs, addDoc, collection, deleteDoc, doc } from "firebase/firestore";

export async function buscarTransacoes(db){
    try {
        const querySnapshot = await getDocs(collection(db, "transacoes"));
        const fetchedTransacoes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return fetchedTransacoes;
    } catch(erro){
        console.log(erro)
        return false;
    }
}

export async function criarTransacao(db, novaTransacao){
    try {
        await addDoc(collection(db, "transacoes"), novaTransacao)
        return true;
    } catch(erro){
        console.log(erro)
        return false;
    }
}

export async function deletarTransacao(db, transacaoId){
    try {
        await deleteDoc(doc(db, "transacoes", transacaoId))
        return true;
    } catch (erro){
        console.log(erro)
        return false;
    }
}
