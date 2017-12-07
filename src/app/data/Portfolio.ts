export class PortfolioEintrag {
  IDKategorie: number;
  IDKlasse: number;
  KName: string="-";
  schuljahr: number;
  titel: string;
  wert: string="?";
}

export class Portfolio {
  ID_Schueler: number;
  eintraege: PortfolioEintrag[];
}
