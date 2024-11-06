import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/enviroment.prod';
import {
  getFirestore,
  doc,
  getDocs,
  arrayRemove,
  arrayUnion,
  collection,
  updateDoc,
  query,
  where,
  setDoc,
  getDoc,
  onSnapshot,
  deleteDoc,
  getDocFromServer,
  getDocsFromServer,
} from 'firebase/firestore';
import {
  deleteObject,
  getStorage,
  getDownloadURL,
  uploadBytes,
  ref,
  uploadString,
  uploadBytesResumable,
} from 'firebase/storage';
import {
  ModelBussinesData,
  ModelCategory,
  ModelProduct,
  ModelPromo,
  ModelService,
} from '../interfaces/Global.interface';
import { VariablesService } from './variables.service';
import { GlobalObservablesService } from './global-observables.service';
let app: any = null;
let db: any = null;
let messaging: any = null;

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  storage: any;
  storageRef: any;
  databaseRealTime: any;
  metadata = {
    contentType: 'image/png',
  };
  metadatav = {
    contentType: 'video/mp4',
  };

  constructor(
    public variables: VariablesService,
    public gObservable: GlobalObservablesService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    if (isPlatformBrowser(_platformId)) {
      app = initializeApp(environment.firebaseConfig);
      db = getFirestore(app);

      this.storage = getStorage();
      this.storageRef = ref(this.storage);
    }
  }
  // ************************************************************ Categories
  async getCategories2() {
    console.log('getCategoriesSERVER');
    let model: ModelCategory[] = [];
    try {
      let snap = await getDoc(doc(db, 'categories', 'all'));

      if (snap.exists()) {
        console.log(snap.data());
        let m = snap.data() as any;
        model = m.categories as ModelCategory[];
        await this.variables.updateCategories(m);
        this.gObservable.setCat = 'get';
      }
    } catch (err) {
      console.log(err);
    }
    return model;
  }
  async subscribeCatUpdates() {
    let model: ModelCategory[] = [];
    try {
      onSnapshot(doc(db, 'categories', 'all'), async (doc) => {
        if (doc.exists()) {
          let m = doc.data() as any;
          model = m.categories as ModelCategory[];

          await this.variables.setCategories(model);
          this.gObservable.setCat = 'listen';
        }
      });
    } catch (err) {}
    return model;
  }
  async createCategory(
    model: ModelCategory,
    action: string,
    img: any,
    child: string
  ) {
    const refDB = doc(db, 'categories', 'all');
    const refST = ref(this.storage, child);

    model.image = '';
    if (img != null) {
      let res = await uploadBytes(refST, img, this.metadata);
      let url = await getDownloadURL(res.ref);
      if (url != undefined) {
        model.image = url;
      }
    }
    try {
      await updateDoc(refDB, { categories: arrayUnion(model) })
        .then(async () => {
          await this.variables.updateCategories(model);
          this.gObservable.setCat = action;
        })
        .catch((err) => {
          this.gObservable.setCat = 'error ' + action;
        });
    } catch (err) {
      console.log(err);
    }
  }
  async updateCategory(
    model: ModelCategory,
    oModel: ModelCategory,
    action: string,
    img: any,
    child: string
  ) {
    const refDB = doc(db, 'categories', 'all');
    const refST = ref(this.storage, child);

    if (img != null) {
      let res = await uploadBytes(refST, img, this.metadata);
      let url = await getDownloadURL(res.ref);
      if (url != undefined) {
        model.image = url;
      }
    }
    try {
      await updateDoc(refDB, { categories: arrayRemove(oModel) })
        .then(async () => {
          await updateDoc(refDB, { categories: arrayUnion(model) })
            .then(async () => {
              this.gObservable.setCat = action;
            })
            .catch((err) => {
              this.gObservable.setCat = 'error ' + action;
            });
        })
        .catch((err) => {
          this.gObservable.setCat = 'error ' + action;
        });
    } catch (err) {
      console.log(err);
    }
  }
  async deleteCategory(model: ModelCategory) {
    try {
      if (model.image != '') {
        let child = this.extractFileNameFromUrl(model.image);
        if (child != null) {
          const refST = ref(this.storage, child);
          await deleteObject(refST);
          // Profesional y estudiantil... Útiles para agilizar el trabajo y para hacer una manicura de más calidad 💅
          // .then((e) => {
          //   console.log('OK', e);
          // })
          // .catch((err) => {
          //   console.log('ERROR', err);
          // });
        }
      }

      const refDB = doc(db, 'categories', 'all');
      await updateDoc(refDB, {
        categories: arrayRemove(model),
      })
        .then(async () => {
          await this.variables.removeCategories(model);
          this.gObservable.setCat = 'delete';
        })
        .catch(() => {
          this.gObservable.setCat = 'error delete';
        });
      return 'res';
    } catch (err) {
      return null;
    }
  }
  // ******************************************************************************** Promos
  async getPromo(id: string) {
    let model: ModelPromo = structuredClone(this.variables.mPromo);
    try {
      let snap = await getDoc(doc(db, 'promos', id));
      if (snap.exists()) {
        model = snap.data() as ModelPromo;
        await this.variables.setDoc(id, model);
      }
    } catch (err) {
      console.log(err);
    }
    return model;
  }
  async getPromos() {
    let model: ModelPromo[] = [];
    try {
      let snap = await getDocs(collection(db, 'promos'));
      snap.forEach((e) => {
        if (e.exists()) {
          let m = e.data() as ModelPromo;
          model.push(m);
        }
      });
      if (model.length > 0) {
        await this.variables.setPromos(model);
        this.gObservable.setPro = 'get';
      }
    } catch (err) {}
    return model;
  }
  // async subscribeSnapPromos() {
  //   const q = query(collection(db, ""), where('sku', '!=', ''));
  //   try {
  //     onSnapshot(q, async (doc) => {
  //       doc.docChanges().forEach(async (snap) => {
  //         if (snap.type == 'modified' || snap.type == 'removed') {
  //           let m: any = null;

  //           if (type == 'products') m = snap.doc.data() as ModelProduct;
  //           if (type == 'services') m = snap.doc.data() as ModelService;
  //           if (type == 'promos') m = snap.doc.data() as ModelPromo;

  //           if (m != null) {
  //             if (snap.doc.exists()) {
  //               await this.variables.setSnapUpdate(m, type);

  //               if (type == 'products') this.gObservable.setProd = 'listen';
  //               if (type == 'services') this.gObservable.setSer = 'listen';
  //               if (type == 'promos') this.gObservable.setPro = 'listen';
  //             }
  //           }
  //         }
  //       });
  //     });
  //   } catch (err) {}
  // }
  // ******************************************************************************** Services
  async getServices() {
    let model: ModelService[] = [];
    try {
      let snap = await getDocs(collection(db, 'services'));
      snap.forEach((e) => {
        if (e.exists()) {
          let m = e.data() as ModelService;
          model.push(m);
        }
      });
      if (model.length > 0) {
        await this.variables.setServices(model);
        this.gObservable.setSer = 'get';
      }
    } catch (err) {}
    return model;
  }
  async getService(id: string) {
    let model: ModelService = structuredClone(this.variables.mService);
    try {
      let snap = await getDoc(doc(db, 'services', id));
      if (snap.exists()) {
        model = snap.data() as ModelService;
        await this.variables.setDoc(id, model);
      }
    } catch (err) {}
    return model;
  }
  async subscribeServUpdates() {
    const q = query(collection(db, 'services'), where('name', '!=', ''));
    try {
      onSnapshot(q, async (doc) => {
        doc.docChanges().forEach(async (snap) => {
          if (snap.type == 'modified' || snap.type == 'removed') {
            if (snap.doc.exists()) {
              await this.variables.setProductSnap(
                snap.doc.data() as ModelProduct
              );
              this.gObservable.setSer = 'listen';
            }
          }
        });
      });
    } catch (err) {}
  }
  // ******************************************************************************** Product
  async getProducts() {
    let model: ModelProduct[] = [];
    try {
      const q = query(collection(db, 'products'), where('sku', '!=', ''));
      let snap = await getDocsFromServer(collection(db, 'products'));
      snap.forEach((e) => {
        if (e.exists()) {
          let m = e.data() as ModelProduct;
          model.push(m);
        }
      });
      if (model.length > 0) {
        await this.variables.setProducts(model);
        this.gObservable.setProd = 'get';
      }
    } catch (err) {}
    return model;
  }
  async getProduct(id: string) {
    let model: ModelProduct = this.variables.mProduct;
    try {
      let snap = await getDoc(doc(db, 'products', id));
      if (snap.exists()) {
        model = snap.data() as ModelProduct;
        await this.variables.setDoc(id, model);
      }
    } catch (err) {}
    return model;
  }
  extractFileNameFromUrl(url: string): string | null {
    const urlParts = url.split('/');
    const fileNameWithQueryParams = urlParts[urlParts.length - 1];
    const fileNameParts = fileNameWithQueryParams.split('?')[0];
    const fileName = decodeURIComponent(fileNameParts);

    return fileName;
  }
  async simpleDeleteMedia(i: string) {
    try {
      const refST = ref(this.storage, i);
      await deleteObject(refST);
    } catch (err) {}
  }
  async getEvent(accoundId: string, id: string) {
    let product: ModelProduct = this.variables.mProduct;
    try {
      const ref = collection(db, 'userPlatform', accoundId, 'events');
      const q = query(ref, where('id', '==', id));
      const sp = await getDocs(q);

      sp.forEach(async (data) => {
        if (data.exists()) {
          product = data.data() as ModelProduct;
          product.sku = data.id;
          if (product.desc == '') {
            product.desc = 'Descipción no disponible';
          }
        }
      });
    } catch (err) {
      /** CATCH */
    }
    return product;
  }
  // ******************************************************************************* Common
  async createDBDoc<T extends ModelProduct | ModelService | ModelPromo>(
    model: T,
    action: string,
    img: any[],
    vids: any[],
    type: string
  ) {
    let refDB: any = '';
    if (type == 'products') refDB = doc(db, 'products', model.sku);
    if (type == 'services') refDB = doc(db, 'services', model.sku);
    if (type == 'promos') refDB = doc(db, 'promos', model.sku);

    if (refDB != null) {
      model.images = [];
      model.videos = [];

      // Upload Images
      if (img != null) {
        for (let i = 0; i < img.length; i++) {
          let child = type + '/' + model.name + '/' + model.name + i + '.png';
          const refST = ref(this.storage, child);
          let res = await uploadBytes(refST, img[i], this.metadata);
          let url = await getDownloadURL(res.ref);
          if (url != undefined) {
            model.images.push(url);
          }
        }
      }
      if (vids != null) {
        for (let j = 0; j < vids.length; j++) {
          let vChild = type + '/' + model.name + '/' + model.name + j + '.mp4';
          const refVID = ref(this.storage, vChild);
          let res = await uploadBytes(refVID, vids[j], this.metadatav);
          let url = await getDownloadURL(res.ref);
          if (url != undefined) {
            model.videos.push(url);
          }
        }
      }

      try {
        await setDoc(refDB, model)
          .then(async () => {
            await this.variables.updateLocalDoc<T>(model, type);

            if (type == 'products') this.gObservable.setProd = action;
            if (type == 'services') this.gObservable.setSer = action;
            if (type == 'promos') this.gObservable.setPro = action;
          })
          .catch((err) => {
            this.gObservable.setProd = 'error ' + action;
          });
      } catch (err) {
        console.log('TRYMAIN', err);
      }
    }
  }
  async updateDBDoc<T extends ModelProduct | ModelService | ModelPromo>(
    model: T,
    action: string,
    img: any[],
    vids: any[],
    imgDelete: any[],
    vidsDelete: any[],
    type: string
  ) {
    // model.videos = [];
    // console.log('MODELFINAL', imgDelete.length);
    // console.log('MODELFINAL', model.images);
    // console.log('MODELFINAL', model.videos);
    // console.log('MODELFINAL');
    // console.log('MODELFINAL', model.videos);
    // Upload Images
    if (img != null) {
      if (img.length > 0) await this.uploadDocImage(model, img, type);
    }
    // UploadVideos
    if (vids != null) {
      if (vids.length > 0) await this.uploadDocVideo(model, vids, type);
    }
    // Delete images
    if (imgDelete != null) {
      if (imgDelete.length > 0) await this.deleteDocImg(model, imgDelete, type);
    }
    // Delete videos
    if (vidsDelete != null) {
      if (vidsDelete.length > 0)
        await this.deleteDocVid(model, vidsDelete, type);
    }

    try {
      let refDB: any = null;
      if (type == 'products') {
        let m = model as ModelProduct;
        refDB = doc(db, 'products', m.sku);
        await updateDoc(refDB, {
          brand: m.brand,
          category: m.category,
          desc: m.desc,
          discount: m.discount,
          name: m.name,
          price: m.price,
          dateTime: m.dateTime,
          ranking: m.ranking,
          stock: m.stock,
          subcategories: m.subcategories,
        })
          .then(async () => {
            this.gObservable.setProd = action;
          })
          .catch((err) => {
            this.gObservable.setProd = 'error ' + action;
          });
      }
      if (type == 'services') {
        let m = model as ModelService;
        refDB = doc(db, 'services', m.sku);
        await updateDoc(refDB, {
          type: m.type,
          desc: m.desc,
          name: m.name,
          price: m.price,
          ranking: m.ranking,
          dateTime: m.dateTime,
          subcategories: m.subcategories,
        })
          .then(async () => {
            this.gObservable.setSer = action;
          })
          .catch((err) => {
            this.gObservable.setSer = 'error ' + action;
          });
      }
      if (type == 'promos') {
        let m = model as ModelPromo;
        refDB = doc(db, 'promos', m.sku);
        await updateDoc(refDB, {
          type: m.type,
          desc: m.desc,
          name: m.name,
          discount: m.discount,
          count: m.count,
          dateTime: m.dateTime,
          from: m.from,
          to: m.to,
        })
          .then(async () => {
            this.gObservable.setPro = action;
          })
          .catch((err) => {
            this.gObservable.setPro = 'error ' + action;
            console.log('ERROR PROMOS', err);
          });
      }
    } catch (err) {
      console.log('TRYMAIN', err);
    }
  }
  async uploadDocImage(model: any, img: any[], type: string) {
    try {
      for (let i = 0; i < img.length; i++) {
        let child =
          type +
          '/' +
          model.name.replace(' ', '_').trim() +
          '_' +
          Date.now() +
          '/' +
          model.name.replace(' ', '_').trim() +
          '_' +
          Date.now() +
          '.png';
        const refST = ref(this.storage, child);
        let res = await uploadBytes(refST, img[i], this.metadata);
        let url = await getDownloadURL(res.ref);
        if (url != undefined) {
          const refDB = doc(db, type, model.sku);
          await updateDoc(refDB, { images: arrayUnion(url) });
        }
      }
    } catch (err) {
      console.log('TRYMAIN', err);
    }
  }
  async deleteDocImg(model: any, imgs: any[], type: string) {
    try {
      for (let i of imgs) {
        const refDB = doc(db, type, model.sku);
        await updateDoc(refDB, { images: arrayRemove(i) });

        let child = this.extractFileNameFromUrl(i);
        if (child != null) {
          const refST = ref(this.storage, child);
          await deleteObject(refST);
        }
      }
    } catch (err) {
      console.log('TRYMAINERROR DEL', err);
    }
  }
  async uploadDocVideo(model: any, vids: any[], type: string) {
    try {
      for (let j = 0; j < vids.length; j++) {
        let ts = Date.now();
        let vChild =
          type + '/' + model.name + '/' + model.name + '_' + ts + '.mp4';
        const refVID = ref(this.storage, vChild);
        let res = await uploadBytes(refVID, vids[j], this.metadatav);
        let url = await getDownloadURL(res.ref);
        if (url != undefined) {
          const refDB = doc(db, type, model.sku);
          await updateDoc(refDB, { videos: arrayUnion(url) });
        }
      }
    } catch (err) {
      console.log('TRYMAIN', err);
    }
  }
  async deleteDocVid(model: any, vids: any[], action: string) {
    try {
      for (let i of vids) {
        let child = this.extractFileNameFromUrl(i);
        if (child != null) {
          const refST = ref(this.storage, child);
          await deleteObject(refST);

          const refDB = doc(db, 'products', model.sku);
          await updateDoc(refDB, { videos: arrayRemove(i) });
        }
      }
    } catch (err) {
      console.log('TRYMAIN', err);
    }
  }
  async deleteDBDoc<T extends ModelProduct | ModelService | ModelPromo>(
    model: T,
    type: string
  ) {
    try {
      if (model.images.length > 0) {
        for (let i of model.images)
          if (i != '') {
            await this.simpleDeleteMedia(i);
          }
      }

      if (model.videos.length > 0) {
        for (let i of model.videos)
          if (i != '') {
            await this.simpleDeleteMedia(i);
          }
      }

      let refDB: any = null;

      if (type == 'products') refDB = doc(db, 'products', model.sku);
      if (type == 'services') refDB = doc(db, 'services', model.sku);
      if (type == 'promos') refDB = doc(db, 'promos', model.sku);

      await deleteDoc(refDB)
        .then(async () => {
          await this.variables.removeLocalDB(model, type);

          if (type === 'products') this.gObservable.setProd = 'delete';
          if (type === 'services') this.gObservable.setSer = 'delete';
          if (type === 'promos') this.gObservable.setPro = 'delete';
        })
        .catch((err) => {
          this.gObservable.setProd = 'error delete';
        });
      return 'res';
    } catch (err) {
      return null;
    }
  }
  async subscribeSnapUpdates(type: string) {
    const q = query(collection(db, type), where('sku', '!=', ''));
    try {
      onSnapshot(q, async (doc) => {
        doc.docChanges().forEach(async (snap) => {
          if (snap.type == 'modified' || snap.type == 'removed') {
            let m: any = null;

            if (type == 'products') m = snap.doc.data() as ModelProduct;
            if (type == 'services') m = snap.doc.data() as ModelService;
            if (type == 'promos') m = snap.doc.data() as ModelPromo;

            if (m != null) {
              if (snap.doc.exists()) {
                await this.variables.setSnapUpdate(m, type);

                if (type == 'products') this.gObservable.setProd = 'listen';
                if (type == 'services') this.gObservable.setSer = 'listen';
                if (type == 'promos') this.gObservable.setPro = 'listen';
              }
            }
          }
        });
      });
    } catch (err) {}
  }
  // ******************************************************************************* Bussines

  async getBusinessData() {
    let model: ModelBussinesData = this.variables.mBusiness;
    try {
      let snap = await getDocs(collection(db, 'bussines'));
      snap.forEach((e) => {
        if (e.exists()) {
          model = e.data() as ModelBussinesData;
        }
      });
      await this.variables.setBusiness(model);
      this.gObservable.setBussines = model;
    } catch (err) {
      console.log(err);
    }
    return model;
  }
  async subscribeBussinesUpdates() {
    try {
      onSnapshot(doc(db, 'bussines', 'bussines'), async (doc) => {
        let model: ModelBussinesData = this.variables.mBusiness;
        if (doc.exists()) {
          model = doc.data() as ModelBussinesData;
          await this.variables.setBusiness(model);
          // this.gObservable.setBussines = model;
        }
      });
    } catch (err) {}
  }
  async setBusinessData(model: ModelBussinesData) {
    try {
      await setDoc(doc(db, 'bussines', 'bussines'), model);
      await this.variables.setBusiness(model);
      this.gObservable.setBussines = model;
    } catch (err) {
      console.log(err);
    }
    return model;
  }
  // ******************************************************************************** Service
}
