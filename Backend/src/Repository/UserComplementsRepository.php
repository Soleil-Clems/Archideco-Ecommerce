<?php

namespace App\Repository;

use App\Entity\UserComplements;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserComplements>
 */
class UserComplementsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserComplements::class);
    }

    public function findByUserId($value): ?UserComplements
          {
              return $this->createQueryBuilder('u')
                  ->andWhere('u.userId = :val')
                  ->setParameter('val', $value)
                  ->orderBy('u.id', 'ASC')
                  ->setMaxResults(1)
                  ->getQuery()
                  ->getOneOrNullResult()
              ;
          }

    //    /**
    //     * @return UserComplements[] Returns an array of UserComplements objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?UserComplements
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
