export class ConnectionService {

   static getConnection() {
      
      if (!this.connection) {
         console.log('creating connection');
         this.connection = io();
      }

      return this.connection;

   }
}