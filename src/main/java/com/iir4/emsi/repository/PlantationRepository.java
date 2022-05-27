package com.iir4.emsi.repository;

import com.iir4.emsi.domain.Plantation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Plantation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlantationRepository extends JpaRepository<Plantation, Long> {}
