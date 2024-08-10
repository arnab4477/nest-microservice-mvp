import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserBlocks1723247883711 implements MigrationInterface {
  name = 'UserBlocks1723247883711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_blocks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blocker_id" uuid NOT NULL, "blocked_id" uuid NOT NULL, CONSTRAINT "PK_0bae5f5cab7574a84889462187c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_blocks" ADD CONSTRAINT "FK_blocker_id" FOREIGN KEY ("blocker_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_blocks" ADD CONSTRAINT "FK_blocked_id" FOREIGN KEY ("blocked_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_blocks" DROP CONSTRAINT "FK_blocked_id"`);
    await queryRunner.query(`ALTER TABLE "user_blocks" DROP CONSTRAINT "FK_blocker_id"`);
    await queryRunner.query(`DROP TABLE "user_blocks"`);
  }
}
