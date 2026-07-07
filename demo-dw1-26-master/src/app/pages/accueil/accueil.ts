import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accueil',
  imports: [FormsModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {
  nouvelleUrlImage =
    'https://s2.qwant.com/thumbr/474x266/f/b/ad4d78aa76c0c65be16fe233a6aeb2ba6d464a7be6e4234c2e586044830d59/OIP.4IXeglpzpeyzgxRKIH10LAHaEK.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%2Fid%2FOIP.4IXeglpzpeyzgxRKIH10LAHaEK%3Fpid%3DApi&q=0&b=1&p=0&a=0';

  //categories: Categorie[] = []; // pas possible sinon nous n'aurions pas de raffraichissement du composant

  categories = signal<Categorie[]>([]);
  //const [categories, setCategories] = useState([]) // equivalent en react

  idImageEnDeplacement = signal<number | null>(null);

  httpClient = inject(HttpClient);

  ngOnInit() {
    this.chargement();
    // fetch('http://localhost:3000/categories')
    //   .then((resultat) => resultat.json())
    //   .then((categoriesRenvoyees) => console.log(categoriesRenvoyees));
  }

  chargement() {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      this.httpClient
        .get('http://localhost:7777/categories')
        .subscribe((categoriesRenvoyees: any) => {
          this.categories.set(categoriesRenvoyees);
        });
    }

    // const jsonCategories = localStorage.getItem('categories');
    // //on vérifie si il y a des données
    // if (jsonCategories != null) {
    //   //si il y en a, on initialises categories avec le contenu du localstorage
    //   this.categories = JSON.parse(jsonCategories);
    // } else {
    //   //si il n'y en a pas, on initialises categories avec des catégories par défaut
    //   this.categories.set([
    //     { titre: 'Top', images: [] },
    //     { titre: 'Moyen', images: [] },
    //     { titre: 'Nul', images: [] },
    //   ]);
    //   this.sauvegarde();
    // }
  }

  sauvegarde() {
    // const jsonCategories = JSON.stringify(this.categories);
    // localStorage.setItem('categories', jsonCategories);
  }

  onAjoutImage() {
    if (this.nouvelleUrlImage != '') {
      const premiereCategorie = this.categories()[0];
      if (!premiereCategorie) return;

      this.httpClient
        .post('http://localhost:7777/ajout-image', {
          idCategorie: premiereCategorie.id,
          urlImage: this.nouvelleUrlImage,
        })
        .subscribe({
          next: () => this.chargement(), //quoi faire en cas de succes
          error: (erreur) => {
            //quoi faire en cas d'erreur
            if (erreur.status === 409) {
              alert('Cette URL existe déjà dans la tier-list');
            }
            this.chargement();
          },
        });

      // this.categories()[0].images.push(this.nouvelleUrlImage);
      this.nouvelleUrlImage = '';
      // this.sauvegarde();
    }
  }

  onSuppressionImage(idImage: number) {
    //TODO : envoyer l'id de l'image plutot que son index

    this.httpClient
      .delete('http://localhost:7777/supprimer-image/' + idImage)
      .subscribe(() => this.chargement());

    // console.log(indexCategorie, indexImage);
    // //supprimer de this.categories à l'index "indexCategorie"
    // //dans la propriété images, à l'index "indexImage"
    // //note : pour supprimer l'element d'un tableau : monTableau.splice(indexElement,1)
    // this.categories()[indexCategorie].images.splice(indexImage, 1);
    // this.sauvegarde();
  }

  onDeplacement(idImage: number, haut: boolean = true) {
    this.httpClient
      .patch('http://localhost:7777/deplacement-image/' + idImage, { haut })
      .subscribe(() => this.chargement());

    // //on duplique l'image dans la categorie inférieur/supérieur (indexCategorie + 1 ou -1 selon le parametre "haut")
    // const urlImage = this.categories()[indexCategorie].images[indexImage];
    // this.categories()[indexCategorie + (haut ? -1 : 1)].images.push(urlImage);
    // //on supprime l'image originale
    // this.categories()[indexCategorie].images.splice(indexImage, 1);
    // this.sauvegarde();
  }

  onActiverDeplacement(idImage: number) {
    this.idImageEnDeplacement.set(idImage);
  }

  onDeplacerVersCategorie(idCategorie: number) {
    const idImage = this.idImageEnDeplacement();
    if (idImage === null) return;

    this.httpClient
      .patch(`http://localhost:7777/deplacement-image/${idImage}/categorie/${idCategorie}`, {})
      .subscribe(() => {
        this.idImageEnDeplacement.set(null);
        this.chargement();
      });
  }
}