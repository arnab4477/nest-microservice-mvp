import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1723140237895 implements MigrationInterface {
  name = 'Users1723140237895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(20) NOT NULL, "surname" character varying(20) NOT NULL, "username" character varying(20) NOT NULL, "birthdate" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UNQ_username" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_username" ON "users" ("username") `);
    await queryRunner.query(`CREATE INDEX "IDX_birthdate" ON "users" ("birthdate") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_birthdate"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_username"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
