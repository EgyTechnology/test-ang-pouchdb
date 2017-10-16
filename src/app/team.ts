export interface ITeam {
    _id: string;
    teamName: string;
    teamScore: number;
}

export class Team implements ITeam {
    public _id: string;
    public teamName: string;
    public teamScore: number;

    constructor(name?:string, score?: number) {
        this.teamName = (name)? name : "";
        this.teamScore = (score)? score : 0;
    }
}