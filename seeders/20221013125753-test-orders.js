'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Orders',
      [
        {
          orderId: '76e35ec6-de02-432a-aa01-e58703d407f6',
          cartOrderAccessId: '3075ab56-e614-4b64-8874-94d33e825914',
          orderStatus: 'pending',
          subTotal: '148.5',
          tax: '0.06',
          taxTotal: '8.91',
          shipping: '10',
          orderDiscount: '0',
          total: '167.41',
          firstName: 'Otto',
          lastName: 'Jones',
          street: '124 Main St',
          city: 'Columbia',
          state: 'SC',
          zipCode: '29226',
          email: 'ottojones@gmail.com',
          homePhone: '555-342-9236',
          cellPhone: '555-420-1583',
          comments: null,
          createdAt: '2022-10-13T12:54:07.243Z',
          updatedAt: '2022-10-13T13:02:18.451Z',
        },
        {
          orderId: '3dd7bd5d-436f-4087-8550-324722bc43c5',
          cartOrderAccessId: '512edbde-a938-4216-8181-0ef9ba456e2f',
          orderStatus: 'pending',
          subTotal: '285.29',
          tax: '0.06',
          taxTotal: '17.15',
          shipping: '10',
          orderDiscount: '0',
          total: '312.15',
          firstName: 'Mike',
          lastName: 'Strange',
          street: '107 Juanita Dr',
          city: 'Charlotte',
          state: 'NC',
          zipCode: '29226',
          email: 'mikestrange@gmail.com',
          homePhone: '555-980-2589',
          cellPhone: '555-409-2947',
          comments: null,
          createdAt: '2022-10-13T12:54:07.243Z',
          updatedAt: '2022-10-13T13:05:27.448Z',
        },
        // {
        //   orderId: '35162a24-face-4b83-8914-3c93f4639597',
        //   cartOrderAccessId: '09f8af99-3a84-41c5-bcc2-70fd5807dbf8',
        //   orderStatus: 'pending',
        //   subTotal: '225',
        //   tax: '0.06',
        //   taxTotal: '13.50',
        //   shipping: '10',
        //   orderDiscount: '0',
        //   total: '248.50',
        //   firstName: 'Debrah',
        //   lastName: 'Johnson',
        //   street: '14327 Old Dubbin Dr',
        //   city: 'Huntersville',
        //   state: 'NC',
        //   zipCode: '28078',
        //   email: 'debrahjohnson@gmail.com',
        //   homePhone: '555-798-4321',
        //   cellPhone: '555-420-1583',
        //   comments: null,
        //   createdAt: '2022-10-13T12:54:07.243Z',
        //   updatedAt: '2022-10-13T13:07:09.925Z',
        // },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', null, {});
  },
};
