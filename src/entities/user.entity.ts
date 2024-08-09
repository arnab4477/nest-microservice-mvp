import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 20 })
  surname: string;

  @Column({ unique: true, length: 20 })
  @Index('IDX_username')
  username: string;

  @Column({ type: 'date' })
  @Index('IDX_birthdate')
  birthdate: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
