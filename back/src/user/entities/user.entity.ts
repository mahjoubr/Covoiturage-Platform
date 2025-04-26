import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    TableInheritance,
  } from 'typeorm';
  
  @Entity()
  @TableInheritance({ column: { type: 'varchar', name: 'type' } })
  export abstract class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  }
  