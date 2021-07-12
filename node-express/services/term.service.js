export default class TermService {
    nextId = 4;
    terms = [
        {
            id: 1,
            word: "Nebraska",
            definition: "Lincoln"
        },
        {
            id: 2,
            word: "Massachusetts",
            definition: "Boston"
        },
        {
            id: 3,
            word: "California",
            definition: "Sacramento"
        }
    ];

    constructor() {
    }

    getTerm(id){
        return this.terms.find((term) => term.id === +id)
    }

    getTerms(){
        return this.terms;
    }

    addTerm(term){
        const newTerm = { ...term};
        newTerm.id = this.nextId;
        this.nextId++;
        this.terms.push(newTerm);
        return newTerm;
    }

    updateTerm(id, body){
        const term = this.terms.find((term) => term.id === +id)
        if(term){
            term.word = body.word;
            term.definition = body.definition;
        }
        return term;
    }

    deleteTerm(id){
        const termIndex = this.terms.findIndex((term) => term.id === +id)
        if(termIndex > -1){
            this.terms.splice(termIndex, 1);
            return true;
        }
        return false
    }
}