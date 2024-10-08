import { getDocs, addDoc, collection, deleteDoc, doc } from "firebase/firestore";

export async function buscarTransacoes(db){
    try {
        const querySnapshot = await getDocs(collection(db, "transactions"));
        const fetchedTransactions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return fetchedTransactions;
    } catch(erro){
        console.log(erro)
        return false;
    }
}

export async function criarTransacao(db, novaTransacao){
    try {
        await addDoc(collection(db, "transactions"), novaTransacao)
        return true;
    } catch(erro){
        console.log(erro)
        return false;
    }
}

export async function deletarTransacao(db, transacaoId){
    try {
        await deleteDoc(doc(db, "transactions", transacaoId))
        return true;
    } catch (erro){
        console.log(erro)
        return false;
    }
}
