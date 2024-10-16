const bcrypt = require('bcrypt');
const db = require('../database/database');

class User {
    // Método para verificar se o nameUser já existe
    static findByUsername(nameUser) {
      return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE nameUser = ?`, [nameUser], (err, user) => {
          if (err) {
            return reject(err);
          }
          resolve(user);
        });
      });
    }
  
    // Método para criar um novo usuário (Pessoa Jurídica)
    static async create(data) {
      try {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const hashedPasswordS = await bcrypt.hash(data.passwordSecurity, 10);
  
        return new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO users (nameUser, password, companyName, email, telephone, cnpj, address, neighborhood, cep, city, uf, passwordSecurity, isAdm)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              data.nameUser,
              hashedPassword,
              data.companyName,
              data.email,
              data.telephone,
              data.cnpj,
              data.address,
              data.neighborhood,
              data.cep,
              data.city,
              data.uf,
              hashedPasswordS,
              data.isAdm ? 1 : 0
            ],
            function (err) {
              if (err) {
                return reject(err);
              }
              resolve({ success: true, id: this.lastID });
            }
          );
        });
      } catch (error) {
        throw new Error('Erro ao criar o usuário: ' + error.message);
      }
    }
  
  // Método para atualizar os campos permitidos do usuário, incluindo a senha
  static async updateUser(id, data) {
    try {
      const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : null;
  
      return new Promise((resolve, reject) => {
        let query = `
              UPDATE users SET
              nameUser = ?,
              companyName = ?,  /* Adiciona a Razão Social */
              telephone = ?,
              cnpj = ?,  /* Adiciona o CNPJ */
              address = ?,
              neighborhood = ?,
              cep = ?,
              city = ?,
              uf = ?
            `;
        const params = [
          data.nameUser,
          data.companyName,  // Atualiza Razão Social
          data.telephone,
          data.cnpj,  // Atualiza CNPJ
          data.address,
          data.neighborhood,
          data.cep,
          data.city,
          data.uf
        ];
  
        if (hashedPassword) {
          query += `, password = ?`;
          params.push(hashedPassword);
        }
  
        query += ` WHERE id = ?`;
        params.push(id);
  
        db.run(query, params, function (err) {
          if (err) {
            return reject(err);
          }
          resolve({ success: true });
        });
      });
    } catch (error) {
      throw new Error('Erro ao atualizar o usuário: ' + error.message);
    }
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, user) => {
        if (err) {
          return reject(err);
        }
        resolve(user);
      });
    });
  }
}  

module.exports = User;
